import type { DefinedNetwork, Network } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';

interface IApiHostData {
  api: string;
  networkId: string;
  chainId: ChainwebChainId;
}

interface IEstatsHostData {
  api: string;
  account: string;
  chain: ChainwebChainId;
}

export interface INetworkData {
  networkId: Network;
  label: string;
  API: string;
  ESTATS: string;
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
        ESTATS: kadenaConstants[item].estatsHost(),
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
      ESTATS: kadenaConstants[item].estatsHost(),
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
