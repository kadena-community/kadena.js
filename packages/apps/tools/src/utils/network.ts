import type { DefinedNetwork, Network  } from '@/constants/kadena';
import { kadenaConstants } from '@/constants/kadena';

interface ApiHostData {
  networkId: string;
  chainId: string;
}

export interface NetworkDto {
  networkId: Network;
  label: string;
  API: string;
  apiHost: ({ networkId, chainId }: ApiHostData) => string;
}

const isNetwork = (x: any): x is Network =>
  ['mainnet01', 'testnet04'].includes(x);

export const getConfigNetworkNames = (): DefinedNetwork[] => {
  return Object.keys(kadenaConstants).filter((key) =>
    isNetwork(key),
  ) as DefinedNetwork[];
};

export const getAllNetworks = (
  localStorageNetworks: NetworkDto[],
): NetworkDto[] => {
  const allNetworkObjects: NetworkDto[] = [];

  const configNetworks = getConfigNetworkNames();
  configNetworks.forEach((item: DefinedNetwork) => {
    allNetworkObjects.push({
      networkId: item,
      label: kadenaConstants[item].label,
      API: kadenaConstants[item].API,
      apiHost: kadenaConstants[item].apiHost,
    } as NetworkDto);
  });
  localStorageNetworks.forEach((item) =>
    allNetworkObjects.push({
      ...item,
      apiHost: ({ networkId, chainId }) =>
        `https://${item.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    }),
  );

  return allNetworkObjects;
};
