import type { INETWORK } from '@/app/api/alerts/utils/constants';
import { NETWORKS } from '@/app/api/alerts/utils/constants';
import type { NetworkId, NetworkIds } from '@/constants/kadena';
import { kadenaDefaultNetworks, networksIds } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';

interface IApiHostData {
  api: string;
  networkId: NetworkId;
  chainId: ChainwebChainId;
}

interface IEstatsHostData {
  api: string;
  account: string;
  chain: ChainwebChainId;
}

export interface INetworkData {
  networkId: NetworkId;
  label: string;
  API: string;
  ESTATS: string;
}

export const getAllNetworks = (
  localStorageNetworks: INetworkData[],
): INetworkData[] => {
  const allNetworkObjects: INetworkData[] = [];

  const configNetworksAdded =
    Boolean(localStorageNetworks) &&
    localStorageNetworks.some((item) => networksIds.includes(item.networkId));

  if (!configNetworksAdded) {
    networksIds.forEach((item: NetworkIds) => {
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

  // remove leftover `testnet05` from the localStorage to clean up the users data
  return allNetworkObjects.filter(
    (item) => (item.networkId as string) !== 'testnet05',
  );
};

export const getInitialNetworks = (): INetworkData[] => {
  const allNetworkObjects: INetworkData[] = [];

  networksIds.forEach((item: NetworkIds) => {
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

export const getMainNet = (): INETWORK => {
  return NETWORKS.find((n) => n.key === 'mainnet01') ?? NETWORKS[0];
};

export const getTestNet = (): INETWORK => {
  return NETWORKS.find((network) => network.key === 'testnet04') ?? NETWORKS[1];
};
