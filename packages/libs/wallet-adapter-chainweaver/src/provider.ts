/**
 *
 * This module defines the ChainWeaver Wallet provider interface and implements a detection
 * mechanism for ChainWeaver. The ChainweaverProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 */

import type { IProvider } from '@kadena/wallet-adapter-core';
import type { ResponseType } from './utils';
import { communicate } from './utils';

export interface IChainweaverProvider extends IProvider {
  message: (
    type: string,
    payload: Record<string, unknown>,
  ) => Promise<ResponseType>;
  focus: () => void;
  close: () => void;
}

/**
 * Detects the Chainweaver wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Chainweaver provider or null.
 * @public
 */
export async function detectChainweaverProvider(options?: {
  appName?: string;
  walletUrl?: string;
  // eslint-disable-next-line @rushstack/no-new-null
}): Promise<IChainweaverProvider | null> {
  const walletOrigin = options?.walletUrl ?? 'https://wallet.kadena.io';
  const appName = options?.appName ?? 'dApp';
  const walletName = 'Chainweaver';
  let walletWindow: Window | null = null;

  const sleep = (time: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, time));

  const connect = async () => {
    const wallet = window.open('', walletName, 'width=800,height=800');

    if (!wallet) {
      throw new Error('POPUP_BLOCKED');
    }
    walletWindow = wallet;

    const message = communicate(window, walletWindow, walletOrigin);
    const waitForWallet = async () => {
      for (let i = 0; i < 50; i++) {
        try {
          await Promise.race([
            message('GET_STATUS', { name: appName }),
            sleep(300).then(() => {
              throw new Error('TIMEOUT');
            }),
          ]);
        } catch (e) {
          console.log('error', e);
          continue;
        }
        console.log('wallet is ready');
        break;
      }
    };
    await Promise.race([
      message('GET_STATUS', {
        name: appName,
      }),
      sleep(300).then(() => {
        throw new Error('TIMEOUT');
      }),
    ]).catch(async () => {
      wallet.location.href = walletOrigin;
      // todo: replace this by a better way to know when the wallet is ready
      return waitForWallet();
    });
    // eslint-disable-next-line require-atomic-updates
    return {
      message,
    };
  };

  const provider: IChainweaverProvider = {
    request: async (request) => {
      if (!walletWindow) {
        await connect();
      }
      if (!walletWindow || walletWindow.closed) {
        throw new Error('Failed to connect to Chainweaver wallet');
      }
      const message = communicate(window, walletWindow, walletOrigin);
      return message(request.method, request.params)
        .then((response) => {
          if (response.error) {
            return {
              id: request.id,
              jsonrpc: '2.0',
              error: {
                code: -32603,
                message: String(response.error),
              },
            };
          }
          return {
            id: request.id,
            jsonrpc: '2.0',
            result: response.payload,
          };
        })
        .catch((error) => {
          console.error('Error in Chainweaver request:', error);
          return {
            id: request.id,
            jsonrpc: '2.0',
            error: {
              code: -32603,
              message: 'Internal error',
            },
          };
        });
    },
    message: async (type, payload) => {
      if (!walletWindow) {
        await connect();
      }
      if (!walletWindow || walletWindow.closed) {
        throw new Error('Failed to connect to Chainweaver wallet');
      }
      const message = communicate(window, walletWindow, walletOrigin);
      return message(type, payload);
    },
    on: () => {},
    off: () => {},
    focus: () => walletWindow?.focus(),
    close: () => walletWindow?.close(),
  };
  return provider;
}
