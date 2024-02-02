import type { ChainId } from '@kadena/types';

export const ns = 'common';
export const devnetHost = 'http://localhost:8080';
export const networkId = 'fast-development';
export const grapHost = 'http://localhost:4000/graphql';

export const devnetUrl = (chainId: ChainId) => {
  return `${devnetHost}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const mainNetHost =
  'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact';
