import { createClient } from '@kadena/client';
import { ChainId } from '@kadena/types';

// you can edit this function if you want to use different network like dev-net or a private net
export const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'mainnet01':
      return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    case 'fast-development':
      return `http://localhost:8080/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    case 'testnet04':
    default:
      return `https://api.testnet.chainweb.com/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
  }
};

// configure the client and export the functions
export const {
  listen,
  submit,
  preflight,
  dirtyRead,
  pollCreateSpv,
  pollStatus,
  getStatus,
  createSpv,
} = createClient(apiHostGenerator);
