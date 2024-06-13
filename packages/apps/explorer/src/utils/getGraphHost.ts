export const getGraphHost = (network?: string) => {
  switch (network) {
    case 'mainnet':
      return process.env.KADENA_MAINNET_GRAPH || '';
    case 'testnet':
      return process.env.KADENA_TESTNET_GRAPH || '';
    case 'devnet':
      return process.env.KADENA_DEVNET_GRAPH || '';
    default:
      return process.env.KADENA_GRAPH_HOST || '';
  }
};
