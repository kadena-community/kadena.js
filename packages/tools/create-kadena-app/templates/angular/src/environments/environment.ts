import { ChainId, NetworkId } from '@kadena/types';

// this would normally be your mainnet configuration, but our test contract `free.cka-message-store` has only been deployed on testnet
export const environment: {
  kadenaNetworkId: NetworkId;
  kadenaChainId: ChainId;
  kadenaHost: string;
} = {
  kadenaNetworkId: 'testnet04',
  kadenaChainId: '0',
  kadenaHost: 'api.testnet.chainweb.com',
};
