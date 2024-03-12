import type { ChainId, NetworkId } from '@kadena/types';
import { createClient } from '../../index';

export const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: NetworkId;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'development':
      return `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    default:
      return `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${
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
