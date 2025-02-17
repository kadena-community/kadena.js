import type { NetworkName, NetworkNames } from '@/constants/kadena';
import { kadenaDefaultNetworks } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';

interface IApiHostData {
  api: string;
  networkId: NetworkName;
  chainId: ChainwebChainId;
}

interface IEstatsHostData {
  api: string;
  account: string;
  chain: ChainwebChainId;
}

export interface INetworkData {
  networkId: NetworkName;
  label: string;
  API: string;
  ESTATS: string;
}

export const getConfigNetworkNames = (): NetworkNames[] => {
  return Object.keys(kadenaDefaultNetworks) as NetworkNames[];
};

export const getAllNetworks = (
  localStorageNetworks: INetworkData[],
): INetworkData[] => {
  const allNetworkObjects: INetworkData[] = [];
  const configNetworks = getConfigNetworkNames();

  const configNetworksAdded =
    Boolean(localStorageNetworks) &&
    localStorageNetworks.some((item) =>
      getConfigNetworkNames().includes(item.networkId),
    );

  if (!configNetworksAdded) {
    configNetworks.forEach((item: NetworkNames) => {
      allNetworkObjects.push({
        networkId: item,
        label: kadenaDefaultNetworks[item].label,
        API: kadenaDefaultNetworks[item].API,
        ESTATS: kadenaDefaultNetworks[item].estatsHost(),
      } as INetworkData);
    });
  }

  if (localStorageNetworks.length) {
    localStorageNetworks.forEach((item) =>
      allNetworkObjects.push({
        ...item,
        ESTATS: item.API,
      }),
    );
  }
  return allNetworkObjects.filter(
    (item) => (item.networkId as string) !== 'testnet05',
  );
};

export const getInitialNetworks = (): INetworkData[] => {
  const allNetworkObjects: INetworkData[] = [];
  const configNetworks = getConfigNetworkNames();

  configNetworks.forEach((item: NetworkNames) => {
    allNetworkObjects.push({
      networkId: item,
      label: kadenaDefaultNetworks[item].label,
      API: kadenaDefaultNetworks[item].API,
      ESTATS: kadenaDefaultNetworks[item].estatsHost(),
    } as INetworkData);
  });

  return allNetworkObjects;
};

export const prefixApi = (api: string): string => {
  let scheme = '';
  if (!api.startsWith('http')) {
    scheme = 'https://';
  }
  if (api.includes('localhost')) {
    scheme = 'http://';
  }
  return `${scheme}${api}`;
};

export const getApiHost = ({
  api,
  networkId,
  chainId,
}: IApiHostData): string => {
  return `${prefixApi(api)}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const getEstatsHost = ({
  api,
  account,
  chain,
}: IEstatsHostData): string =>
  `https://${api}/txs/account/${account}?token=coin&chain=${chain}&limit=10`;
