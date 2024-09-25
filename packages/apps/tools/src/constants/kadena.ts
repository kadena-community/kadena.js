import { env } from '@/utils/env';

export type DefinedNetwork = 'mainnet01' | 'testnet04' | 'testnet05';
export type Network = DefinedNetwork | string;
export type DevOption = 'BASIC' | 'BACKEND' | 'DAPP';

type KadenaConstants = {
  [K in DefinedNetwork]: {
    label: string;
    API: string;
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
  mainnet01: {
    label: 'Mainnet',
    API: env('KADENA_MAINNET_API', 'api.chainweb.com'),
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaConstants.mainnet01.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => env('KADENA_MAINNET_ESTATS', 'estats.chainweb.com'),
  },
  testnet04: {
    label: 'Testnet',
    API: env('KADENA_TESTNET_API', 'api.testnet.chainweb.com'),
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaConstants.testnet04.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () =>
      env('KADENA_TESTNET_ESTATS', 'estats.testnet.chainweb.com'),
  },
  testnet05: {
    label: 'Testnet05',
    API: env('KADENA_TESTNET05_API', 'api.testnet05.chainweb.com'),
    apiHost: ({ networkId, chainId }) =>
      `https://${kadenaConstants.testnet05.API}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
    estatsHost: () => '',
  },
  GAS_LIMIT: Number(env('GAS_LIMIT', 850)),
  GAS_PRICE: Number(env('GAS_PRICE', 0.00000001)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
  DEFAULT_SENDER: env('DEFAULT_SENDER', 'not-real'),
};
