import type { IWalletAccount } from '../AccountProvider/utils';

interface ResponseType {
  id: string;
  type: string;
  payload: unknown;
  error: unknown;
}

export interface IState {
  profile: {
    name: string;
    accentColor: string;
    uuid: string;
  };
  accounts: IWalletAccount[];
}

const walletOrigin = () =>
  (window as any).walletUrl || 'https://wallet.kadena.io';
const walletUrl = () => `${walletOrigin()}`;
const walletName = 'Dev-Wallet';
const appName = 'Dev Wallet Example';

export const sleep = (time: number) =>
  new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });

const communicate =
  (client: Window, server: Window) =>
  (type: string, payload: Record<string, unknown>): Promise<ResponseType> => {
    const id = crypto.randomUUID();
    return new Promise((resolve) => {
      const handler = (event: MessageEvent) => {
        if (event.data && event.data.id === id) {
          client.removeEventListener('message', handler);
          resolve(event.data);
          server.blur();
          window.focus();
        }
      };
      client.addEventListener('message', handler);
      server.postMessage({ payload, id, type }, walletOrigin());
    });
  };

let walletGlobal: Window | null = null;
export async function getWalletConnection(page: string = '') {
  if (walletGlobal && !walletGlobal.closed) {
    return {
      message: communicate(window, walletGlobal),
      focus: () => walletGlobal?.focus(),
      close: () => walletGlobal?.close(),
    };
  }

  const wallet = window.open('', walletName, 'width=800,height=800');

  if (!wallet) {
    throw new Error('POPUP_BLOCKED');
  }
  const message = communicate(window, wallet);
  const waitForWallet = async () => {
    for (let i = 0; i < 50; i++) {
      try {
        await Promise.race([
          message('GET_STATUS', {
            name: appName,
          }),
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
    wallet.location.href = walletUrl();
    // todo: replace this by a better way to know when the wallet is ready
    return waitForWallet();
  });
  // eslint-disable-next-line require-atomic-updates
  walletGlobal = wallet;
  return {
    message,
    focus: () => walletGlobal?.focus(),
    close: () => walletGlobal?.close(),
  };
}
