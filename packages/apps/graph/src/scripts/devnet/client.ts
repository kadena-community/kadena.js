import { createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';

// TODO: figure out the endpoint for the devnet
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

export const {
  listen,
  submit,
  // preflight,
  dirtyRead,
  pollCreateSpv,
  pollStatus,
  getStatus,
  createSpv,
} = createClient(apiHostGenerator);
