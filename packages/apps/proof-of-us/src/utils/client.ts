import type { ChainId } from '@kadena/client';
import { createClient } from '@kadena/client';

const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  switch (networkId) {
    case 'fast-development':
      return `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${
        chainId as ChainId
      }/pact`;
    default:
      return `http://127.0.0.1:8080/chainweb/0.0/${networkId}/chain/${
        chainId as ChainId
      }/pact`;
  }
};

export const getClient = () => {
  const client = createClient(apiHostGenerator);
  return client;
};
