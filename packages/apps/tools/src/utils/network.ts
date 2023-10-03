import type { DefinedNetwork, Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';

interface IApiHostData {
  networkId: string;
  chainId: string;
}

export interface INetworkData {
  networkId: Network;
  label: string;
  API: string;
  apiHost: ({ networkId, chainId }: IApiHostData) => string;
  estatsHost: (account: string) => string;
}

const isNetwork = (x: any): x is Network =>
  ['mainnet01', 'testnet04'].includes(x);

export const getConfigNetworkNames = (): DefinedNetwork[] => {
  return Object.keys(kadenaConstants).filter((key) =>
    isNetwork(key),
  ) as DefinedNetwork[];
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
    configNetworks.forEach((item: DefinedNetwork) => {
      allNetworkObjects.push({
        networkId: item,
        label: kadenaConstants[item].label,
        API: kadenaConstants[item].API,
        apiHost: kadenaConstants[item].apiHost,
        estatsHost: kadenaConstants[item].estatsHost,
      } as INetworkData);
    });
  }

  if (localStorageNetworks) {
    localStorageNetworks.forEach((item) =>
      allNetworkObjects.push({
        ...item,
        apiHost: ({ networkId, chainId }) =>
          `https://${item.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
        estatsHost: (account) =>
          `https://${item.API}/txs/account/${account}?limit=100`,
      }),
    );
  }
  return allNetworkObjects;
};

export const getInitialNetworks = (): INetworkData[] => {
  const allNetworkObjects: INetworkData[] = [];
  const configNetworks = getConfigNetworkNames();

  configNetworks.forEach((item: DefinedNetwork) => {
    allNetworkObjects.push({
      networkId: item,
      label: kadenaConstants[item].label,
      API: kadenaConstants[item].API,
      apiHost: kadenaConstants[item].apiHost,
      estatsHost: kadenaConstants[item].estatsHost,
    } as INetworkData);
  });

  return allNetworkObjects;
};
