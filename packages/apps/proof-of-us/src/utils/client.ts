import type { ChainId } from '@kadena/client';
import { createClient } from '@kadena/client';
import { env } from './env';

const apiHostGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => {
  return `https://api.chainweb.com/chainweb/0.0/${networkId}/chain/${chainId}/pact`;
};

export const getClient = () => {
  const client = createClient(
    apiHostGenerator({ networkId: env.NETWORKID, chainId: env.CHAINID }),
  );
  return client;
};
