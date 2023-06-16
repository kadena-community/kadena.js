export const kadenaConstants = {
  MAINNET: {
    API: process.env.KADENA_MAINNET_API ?? '',
    NETWORKS: {
      MAINNET01: 'mainnet01',
    },
    API_HOST: ({
      networkId,
      chainId,
    }: {
      networkId: string;
      chainId: string;
    }) =>
      `${process.env.KADENA_MAINNET_API}/chainweb/0.0/${networkId}/chain/${chainId}/pact` ??
      '',
  },
  TESTNET: {
    API: process.env.KADENA_TESTNET_API ?? '',
    NETWORKS: {
      TESTNET04: 'testnet04',
    },
    API_HOST: ({
      networkId,
      chainId,
    }: {
      networkId: string;
      chainId: string;
    }) =>
      `${process.env.KADENA_TESTNET_API}/chainweb/0.0/${networkId}/chain/${chainId}/pact` ??
      '',
  },
  GAS_PRICE: Number(process.env.GAS_PRICE) ?? 0,
  GAS_LIMIT: Number(process.env.GAS_LIMIT) ?? 0,
  API_TTL: Number(process.env.KADENA_API_TTIL) ?? 0,
};
