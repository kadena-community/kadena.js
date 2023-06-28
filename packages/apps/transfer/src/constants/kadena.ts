import { env } from '@/utils/env';

export type Network = 'MAINNET' | 'TESTNET';

const mainNetApi = env('KADENA_MAINNET_API', 'api.chainweb.com');
const testNetApi = env('KADENA_TESTNET_API', 'api.testnet.chainweb.com');
const mainNetEstats = env('KADENA_MAINNET_ESTATS', 'estats.chainweb.com');
const testNetEstats = env(
  'KADENA_TESTNET_ESTATS',
  'estats.testnet.chainweb.com',
);

type KadenaConstants = {
  [K in Network]: {
    API: string;
    NETWORKS: {
      [key: string]: string;
    };
    apiHost: (params: { networkId: string; chainId: string }) => string;
    estatsHost: () => string;
  };
} & {
  GAS_LIMIT: number;
  GAS_PRICE: number;
  API_TTL: number;
};

export const kadenaConstants: KadenaConstants = {
  MAINNET: {
    API: mainNetApi,
    NETWORKS: {
      MAINNET01: 'mainnet01',
    },
    apiHost: ({ networkId, chainId }) =>
      `${kadenaConstants.MAINNET.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => mainNetEstats,
  },
  TESTNET: {
    API: testNetApi,
    NETWORKS: {
      TESTNET04: 'testnet04',
    },
    apiHost: ({ networkId, chainId }) =>
      `${kadenaConstants.TESTNET.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => testNetEstats,
  },
  GAS_LIMIT: Number(env('GAS_LIMIT', 850)),
  GAS_PRICE: Number(env('GAS_LIMIT', 0.00000001)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
};

export function getKadenaConstantByNetwork(network: Network) {
  return kadenaConstants[network];
}
