import { ChainId, ChainwebNetworkId } from '@kadena/types';

// this would normally be your mainnet configuration, but our test contract has only been deployed on testnet
export const environment: {
  kadenaNetworkId: ChainwebNetworkId
  kadenaChainId: ChainId
  kadenaHost: string
} = {
  kadenaNetworkId: 'testnet04',
  kadenaChainId: '0',
  kadenaHost: 'api.testnet.chainweb.com'
};
