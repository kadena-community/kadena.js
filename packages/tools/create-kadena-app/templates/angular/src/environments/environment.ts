import { ChainId } from '@kadena/client';

// this would normally be your mainnet configuration, but our test contract `free.cka-message-store` has only been deployed on testnet
export const environment: {
  kadenaNetworkId: string;
  kadenaChainId: ChainId;
} = {
  kadenaNetworkId: 'testnet04',
  kadenaChainId: '0',
};
