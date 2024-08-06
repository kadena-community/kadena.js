import type {
  ICommonEckoFunctions,
  IEckoConnectOrStatusResponse,
} from './eckoTypes';

export const isInstalled: ICommonEckoFunctions['isInstalled'] = () => {
  const { kadena } = window;
  return Boolean(kadena && kadena.isKadena && kadena.request);
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

  return checkStatusResponse?.status === 'success';
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

export const checkStatus: ICommonEckoFunctions['checkStatus'] = async (
  networkId,
) => {
  if (!isInstalled()) {
    throw new Error('Ecko Wallet is not installed');
  }

  await connect(networkId);

  const checkstatusResponse =
    await window.kadena?.request<IEckoConnectOrStatusResponse>({
      method: 'kda_checkStatus',
      networkId,
    });

  if (checkstatusResponse?.status === 'fail') {
    throw new Error('Error getting status from Ecko Wallet');
  }

  return checkstatusResponse;
};
