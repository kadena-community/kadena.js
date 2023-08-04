import { ChainId, NetworkId } from '@kadena/types';

import { getClient } from '../../index';

export const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: NetworkId;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'fast-development':
      return `http://localhost:8080/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
    default:
      return `http://localhost:8080/chainweb/0.0/${networkId}/chain/${
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
} = getClient(apiHostGenerator);
