import { ChainId, ChainwebNetworkId } from '@kadena/types';

export const environment: {
  kadenaNetworkId: ChainwebNetworkId
  kadenaChainId: ChainId
  kadenaHost: string
} = {
  kadenaNetworkId: 'testnet04',
  kadenaChainId: '0',
  kadenaHost: 'api.testnet.chainweb.com'
};
