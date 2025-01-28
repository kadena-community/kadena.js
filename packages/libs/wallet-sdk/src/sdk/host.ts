/**
 * @public
 */
export type GraphType = 'kadena' | 'hackachain';

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
export type GraphqlHostGenerator = (options: {
  networkId: string;
  graphType?: GraphType;
}) => string;

// Kadena GraphQL Host Map
const kadenaGraphqlHostMap: Record<string, string> = {
  mainnet01: 'https://graph.kadena.network/graphql',
  testnet04: 'https://graph.testnet.kadena.network/graphql',
};

// Hackachain GraphQL Host Map
const hackachainGraphqlHostMap: Record<string, string> = {
  mainnet01: 'https://www.kadindexer.io/graphql',
  testnet04: 'https://www.kadindexer.io/graphql',
};

// Chainweb Host Map
const chainwebHostMap: Record<string, string | string[]> = {
  mainnet01: 'https://api.chainweb.com',
  testnet04: 'https://api.testnet.chainweb.com',
};

/**
 * @public
 */
export const defaultChainwebHostGenerator: ChainwebHostGenerator = (
  options,
) => {
  return `${chainwebHostMap[options.networkId]}/chainweb/0.0/${options.networkId}/chain/${options.chainId}/pact`;
};

/**
 * @public
 */
export const defaultGraphqlHostGenerator: GraphqlHostGenerator = (options) => {
  const { networkId, graphType = 'kadena' } = options;

  switch (graphType) {
    case 'kadena':
      if (!kadenaGraphqlHostMap[networkId]) {
        // eslint-disable-next-line no-console
        console.warn(
          `[defaultGraphqlHostGenerator] Network ${networkId} not supported for Kadena graph`,
        );
      }
      return kadenaGraphqlHostMap[networkId];

    case 'hackachain':
      if (!hackachainGraphqlHostMap[networkId]) {
        // eslint-disable-next-line no-console
        console.warn(
          `[defaultGraphqlHostGenerator] Network ${networkId} not supported for Hackachain graph`,
        );
      }
      return hackachainGraphqlHostMap[networkId];

    default:
      return kadenaGraphqlHostMap[networkId];
  }
};
