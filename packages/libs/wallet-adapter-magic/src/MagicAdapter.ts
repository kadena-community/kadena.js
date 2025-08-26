/**
 * MagicAdapter
 *
 * This module provides a comprehensive adapter implementation for Magic Wallet,
 * extending the BaseWalletAdapter from '@kadena/wallet-adapter-core'. It serves as a bridge
 * between your dApp and the Magic Wallet browser extension, enabling you to:
 *
 * - Detect the Magic Wallet provider and initialize connection parameters.
 * - Connect to the wallet and fetch account and network information.
 * - Handle account and network change events, ensuring your application stays in sync
 *   with the wallet's current state.
 *
 *   IMPORTANT: We wont do page-refreshes, as implemented by some solutions to bypass this,
 *   by doing window.location.reload(),
 *   we cannot expect DAPPs to expect this, as they will not be aware of the change.
 *
 * - Sign transactions and commands using the Magic Wallet's signing functionality.
 * - Manage connection state with robust error handling for scenarios such as failed connections
 *   or invalid network selections.
 * - Clean up event listeners via the destroy() method to prevent memory leaks.
 *
 * Note:
 * - The adapter does not support network switching via `kadena_changeNetwork_v1`.
 */

import type { IQuicksignResponse } from '@kadena/client';
import { createTransaction } from '@kadena/client';
import type {
  ChainId,
  CommandSigDatas,
  IAccountInfo,
  IBaseWalletAdapterOptions,
  ICommand,
  IKdaMethodMap,
  KdaMethod,
} from '@kadena/wallet-adapter-core';
import { BaseWalletAdapter } from '@kadena/wallet-adapter-core';
import { KadenaExtension } from '@magic-ext/kadena';
import type { Extension } from 'magic-sdk';
import { Magic } from 'magic-sdk';
import { ERRORS, MAGIC_ADAPTER } from './constants';
import { safeJsonParse } from './utils/json';

export interface IMagicAdapterOptions {
  chainwebApiUrl?: string;
  chainId?: string;
  magicApiKey?: string;
}

type IMagicAdapterOptionsWithProvider = IMagicAdapterOptions &
  IBaseWalletAdapterOptions;

/**
 * @public
 * MagicAdapter is a class that extends BaseWalletAdapter to provide
 * functionality for connecting to the Magic Wallet.
 */
export class MagicAdapter extends BaseWalletAdapter {
  public name: string = MAGIC_ADAPTER;

  private _magic: Magic | null = null;
  private _account: IAccountInfo | null = null;

  /**
   * Constructor for the MagicAdapter.
   * @param options - Optional adapter options.
   */
  public constructor(options: IMagicAdapterOptionsWithProvider) {
    super(options);

    if (
      !options.magicApiKey ||
      !options.chainwebApiUrl ||
      !options.chainId ||
      !options.networkId
    ) {
      throw new Error(
        'Missing some or all required options: magicApiKey, chainwebApiUrl, chainId, networkId',
      );
    }

    const kdaExtension = new KadenaExtension({
      rpcUrl: options.chainwebApiUrl,
      chainId: options.chainId as ChainId,
      networkId: options.networkId,
      createAccountsOnChain: true,
    }) as unknown as Extension<string>;

    this._magic = new Magic(options.magicApiKey, {
      extensions: [kdaExtension],
    });
  }

  private async _connect(): Promise<IAccountInfo | null> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    if (!this._magic) throw new Error(ERRORS.MAGIC_NOT_INITIALIZED);

    const account = await (
      this._magic.kadena as KadenaExtension
    ).loginWithSpireKey();

    if (!account.keyset) {
      console.error('Invalid account guard or keyset', account);
      throw new Error(ERRORS.COULD_NOT_FETCH_ACCOUNT);
    }

    this._account = {
      accountName: account.accountName,
      contract: account.requestedFungibles?.[0].fungible ?? 'coin',
      existsOnChains: account.chainIds,
      networkId: account.networkId,
      guard: account.guard ?? account.keyset,
      keyset: account.keyset,
    };

    return this._account;
  }

  // --------------------------------------------------------------------------
  // REQUEST HANDLING
  // --------------------------------------------------------------------------
  /**
   * Handles requests to the provider by mapping method names to provider calls.
   *
   * @param args - The method and parameters for the request.
   * @returns A promise resolving to the response, cast to the appropriate type.
   * @throws Error if the provider is not detected or the method is unsupported.
   *
   * This implementation supports extended methods from IKdaMethodMap, including special handling
   * for 'kadena_checkStatus'.
   */
  public async request<M extends KdaMethod>(args: {
    id: number;
    method: M;
    params?: IKdaMethodMap[M]['params'];
  }): Promise<IKdaMethodMap[M]['response']> {
    if (!this.provider) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);
    if (!this._magic) throw new Error(ERRORS.PROVIDER_NOT_DETECTED);

    const { id, method, params = {} } = args;

    switch (method) {
      case 'kadena_connect': {
        // In request mode, we do not use silent mode.
        const account = await this._connect();
        if (!account) {
          throw new Error(ERRORS.FAILED_TO_CONNECT);
        }
        return {
          id,
          jsonrpc: '2.0',
          result: account,
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_disconnect': {
        return {
          id,
          jsonrpc: '2.0',
          result: undefined,
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_getAccount_v1': {
        if (!this._account) {
          await this._connect();
        }
        return {
          id,
          jsonrpc: '2.0',
          result: this._account,
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_getAccounts_v2': {
        if (!this._account) {
          await this._connect();
        }
        return {
          id,
          jsonrpc: '2.0',
          result: [this._account],
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_getNetwork_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Not implemented', data: {} },
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_getNetworks_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: { code: -32601, message: 'Not implemented', data: {} },
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_sign_v1': {
        return {
          id,
          jsonrpc: '2.0',
          error: {
            code: -32601,
            message: 'Not supported by Magic. Use kadena_quicksign_v1 instead.',
            data: {},
          },
        } as IKdaMethodMap[M]['response'];
      }
      case 'kadena_quicksign_v1': {
        const { commandSigDatas } = params as {
          commandSigDatas: CommandSigDatas;
        };

        const results = await Promise.all(
          commandSigDatas.map(async (commandSigData) => {
            if (!this._magic) throw new Error(ERRORS.MAGIC_NOT_INITIALIZED);

            const parsed = safeJsonParse(commandSigData.cmd);
            if (!parsed) {
              throw new Error(ERRORS.INVALID_PARAMS);
            }

            const tx = createTransaction(parsed);
            tx.sigs = commandSigData.sigs.map((sig) => ({
              sig: sig.sig ?? undefined,
              pubKey: sig.pubKey,
            }));

            const { transactions } = await (
              this._magic.kadena as KadenaExtension
            ).signTransactionWithSpireKey(tx);

            return transactions[0] as ICommand;
          }),
        );

        if (!Array.isArray(results)) {
          throw new Error(ERRORS.ERROR_SIGNING_TRANSACTION);
        }

        const responses = results.map((result) => {
          return {
            commandSigData: { cmd: result.cmd, sigs: result.sigs },
            outcome: { result: 'success', hash: result.hash },
          };
        });

        return {
          id,
          jsonrpc: '2.0',
          result: { responses } as IQuicksignResponse,
        } as IKdaMethodMap[M]['response'];
      }
      default:
        return (await this.provider.request(args)) as any;
    }
  }
}
