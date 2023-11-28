import type {
  ICommonKoalaFunctions,
  IKoalaConnectOrStatusResponse,
} from './koalaTypes';

export const isInstalled: ICommonKoalaFunctions['isInstalled'] = () => {
  const { koala } = window;
  return Boolean(koala && koala.isKoala && koala.request);
};

export const isConnected: ICommonKoalaFunctions['isConnected'] = async (
  networkId,
) => {
  if (!isInstalled()) {
    return false;
  }

  const checkStatusResponse =
    await window.koala?.request<IKoalaConnectOrStatusResponse>({
      method: 'kda_checkStatus',
      networkId,
    });

  return checkStatusResponse?.status === 'success';
};

export const connect: ICommonKoalaFunctions['connect'] = async (networkId) => {
  if (!isInstalled()) {
    throw new Error('Koala Wallet is not installed');
  }

  if (await isConnected(networkId)) {
    return true;
  }

  const connectResponse =
    await window.koala?.request<IKoalaConnectOrStatusResponse>({
      method: 'kda_connect',
      networkId,
    });

  if (connectResponse?.status === 'fail') {
    throw new Error('User declined connection');
  }

  return true;
};
