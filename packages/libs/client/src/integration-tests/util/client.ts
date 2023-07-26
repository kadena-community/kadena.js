import { ChainId, NetworkId } from '@kadena/types';

import { getClient } from '../../index';

// you can edit this function if you want to use different network like dev-net or a private net
export const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: NetworkId;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    default:
      return `https://localhost:8080/chainweb/0.0/${networkId}/chain/${
        chainId ?? '1'
      }/pact`;
  }
};

// configure the client and export the functions
export const {
  submit,
  preflight,
  dirtyRead,
  pollCreateSpv,
  pollStatus,
  getStatus,
  createSpv,
} = getClient(apiHostGenerator);
