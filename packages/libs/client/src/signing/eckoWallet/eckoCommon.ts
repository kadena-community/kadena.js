import {
  IEckoAccountsResponse,
  IEckoConnectOrStatusResponse,
} from './eckoTypes';

export const isInstalled: ICommonEckoFunctions['isInstalled'] = () => {
  const { kadena } = window;
  return Boolean(kadena && kadena.isKadena);
};

export const isConnected: ICommonEckoFunctions['isConnected'] = async (
  networkId,
) => {
  if (!isInstalled()) {
    return false;
  }

  const checkStatusResponse =
    await window.kadena?.request<IEckoConnectOrStatusResponse>({
      method: 'kda_checkStatus',
      networkId,
    });

  if (checkStatusResponse?.status === 'fail') {
    return false;
  }

  return true;
};

export const connect: ICommonEckoFunctions['connect'] = async (networkId) => {
  if (!isInstalled()) {
    throw new Error('Ecko Wallet is not installed');
  }

  if (await isConnected(networkId)) {
    return true;
  }

  const connectResponse =
    await window.kadena?.request<IEckoConnectOrStatusResponse>({
      method: 'kda_connect',
      networkId,
    });

  if (connectResponse?.status === 'fail') {
    throw new Error('User declined connection');
  }

  return true;
};

export const getAccountInfo = async (
  networkId: string,
): Promise<IEckoAccountsResponse | undefined> => {
  return window.kadena?.request<IEckoAccountsResponse>({
    method: 'kda_requestAccount',
    networkId,
  });
};
