import { env } from '@/utils/env';
import type { ChainwebNetworkId } from '@kadena/chainweb-node-client';

export type NetworkIds = Exclude<ChainwebNetworkId, 'development'>;
export type NetworkId = NetworkIds | string;

export type DevOption = 'BASIC' | 'BACKEND' | 'DAPP';

interface KadenaConstants {
  GAS_LIMIT: number;
  GAS_PRICE: number;
  API_TTL: number;
  DEFAULT_SENDER: string;
}

interface NetworkType {
  label: string;
  API: string;
  apiHost: (params: { networkId: NetworkId; chainId: string }) => string;
  estatsHost: () => string;
  graphUrl: string;
  wsGraphUrl: string;
}

export const kadenaConstants: KadenaConstants = {
  GAS_LIMIT: Number(env('GAS_LIMIT', 850)),
  GAS_PRICE: Number(env('GAS_PRICE', 0.00000001)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
  DEFAULT_SENDER: env('DEFAULT_SENDER', 'not-real'),
};

export const kadenaDefaultNetworks: Record<NetworkIds, NetworkType> = {
  mainnet01: {
    label: 'Mainnet',
    API: env('KADENA_MAINNET_API', 'api.chainweb.com'),
    graphUrl: 'https://graph.kadena.network/graphql',
    wsGraphUrl: 'https://graph.kadena.network/graphql',
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaDefaultNetworks.mainnet01.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => env('KADENA_MAINNET_ESTATS', 'estats.chainweb.com'),
  },
  testnet04: {
    label: 'Testnet',
    API: env('KADENA_TESTNET_API', 'api.testnet.chainweb.com'),
    graphUrl: 'https://graph.testnet.kadena.network/graphql',
    wsGraphUrl: 'https://graph.testnet.kadena.network/graphql',
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaDefaultNetworks.testnet04.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () =>
      env('KADENA_TESTNET_ESTATS', 'estats.testnet.chainweb.com'),
  },
} as const;

export const networksIds = Object.keys(kadenaDefaultNetworks) as NetworkIds[];
