import { env } from '@/utils/env';

const mainNetApi = env('KADENA_MAINNET_API', 'api.chainweb.com');
const testNetApi = env('KADENA_TESTNET_API', 'api.testnet.chainweb.com');
export const kadenaConstants = {
  MAINNET: {
    API: mainNetApi,
    NETWORKS: {
      MAINNET01: 'mainnet01',
    },
    API_HOST: ({
      networkId,
      chainId,
    }: {
      networkId: string;
      chainId: string;
    }) => `${mainNetApi}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  },
  TESTNET: {
    API: testNetApi,
    NETWORKS: {
      TESTNET04: 'testnet04',
    },
    API_HOST: ({
      networkId,
      chainId,
    }: {
      networkId: string;
      chainId: string;
    }) => `${testNetApi}/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
  },
  GAS_LIMIT: Number(env('GAS_LIMIT', 750)),
  API_TTL: Number(env('KADENA_API_TTIL', 600000)),
};
