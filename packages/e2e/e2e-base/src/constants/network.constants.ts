import type { ChainId } from '@kadena/types';

export const ns = 'common';
export const devnetHost = 'http://localhost:8080';
export const networkId = 'development';
export const grapHost = 'http://localhost:4000/graphql';

export const devnetUrl = (chainId: ChainId) => {
  return `${devnetHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};
export const faucetNamespace = 'n_34d947e2627143159ea73cdf277138fd571f17ac';
export const mainNetHost =
  'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact';
