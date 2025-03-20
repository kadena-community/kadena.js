/**
 * @public
 */
export type ChainwebHostGenerator = (options: {
  networkId: string;
  chainId: string;
}) => string;

/**
 * @public
 */
export type GraphqlHostGenerator = (options: { networkId: string }) => string;

const chainwebHostMap: Record<string, string | string[]> = {
  mainnet01: 'https://api.chainweb.com',
  testnet04: 'https://api.testnet.chainweb.com',
};

export const defaultChainwebHostGenerator: ChainwebHostGenerator = (
  options,
) => {
  return `${chainwebHostMap[options.networkId]}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`;
};

const graphqlHostMap: Record<string, string> = {
  mainnet01: 'https://www.kadindexer.io/graphql',
  testnet04: 'https://testnet.kadindexer.io/graphql',
};

export const defaultGraphqlHostGenerator: GraphqlHostGenerator = (options) => {
  if (graphqlHostMap[options.networkId] === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      `[defaultGraphqlHostGenerator] Network ${options.networkId} not supported`,
    );
  }
  return graphqlHostMap[options.networkId];
};
