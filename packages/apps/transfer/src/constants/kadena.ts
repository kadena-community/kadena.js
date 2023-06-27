import { env } from '@/utils/env';

const mainNetApi = env('KADENA_MAINNET_API', 'api.chainweb.com');
const testNetApi = env('KADENA_TESTNET_API', 'api.testnet.chainweb.com');

// eslint-disable-next-line @kadena-dev/typedef-var
export const kadenaConstants = {
  MAINNET: {
    API: mainNetApi,
    NETWORKS: {
      MAINNET01: 'mainnet01',
    },
    apiHost: ({ networkId, chainId }: { networkId: string; chainId: string }) =>
      `${mainNetApi}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  },
  TESTNET: {
    API: testNetApi,
    NETWORKS: {
      TESTNET04: 'testnet04',
    },
    apiHost: ({ networkId, chainId }: { networkId: string; chainId: string }) =>
      `${testNetApi}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  },
  GAS_LIMIT: Number(env('GAS_LIMIT', 850)),
  GAS_PRICE: Number(env('GAS_LIMIT', 0.00000001)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
} as const;
