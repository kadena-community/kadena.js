import { env } from '@/utils/env';

export type Network = 'MAINNET' | 'TESTNET';
export type DevOption = 'BASIC' | 'BACKEND' | 'DAPP';

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
  DEFAULT_SENDER: string;
};

export const kadenaConstants: KadenaConstants = {
  MAINNET: {
    API: env('KADENA_MAINNET_API', 'api.chainweb.com'),
    NETWORKS: {
      MAINNET01: 'mainnet01',
    },
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaConstants.MAINNET.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => env('KADENA_MAINNET_ESTATS', 'estats.chainweb.com'),
  },
  TESTNET: {
    API: env('KADENA_TESTNET_API', 'api.testnet.chainweb.com'),
    NETWORKS: {
      TESTNET04: 'testnet04',
    },
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaConstants.TESTNET.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () =>
      env('KADENA_TESTNET_ESTATS', 'estats.testnet.chainweb.com'),
  },
  GAS_LIMIT: Number(env('GAS_LIMIT', 850)),
  GAS_PRICE: Number(env('GAS_PRICE', 0.00000001)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
  DEFAULT_SENDER: env('DEFAULT_SENDER', 'not-real'),
};

export const getKadenaConstantByNetwork = (
  network: Network,
): KadenaConstants[Network] => {
  return kadenaConstants[network];
};
