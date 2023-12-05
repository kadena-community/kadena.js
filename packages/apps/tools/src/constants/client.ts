import type { DefinedNetwork } from '@/constants/kadena';
import { getKadenaConstantByNetwork } from '@/constants/kadena';
import type { ChainId, IClient } from '@kadena/client';
import { createClient } from '@kadena/client';

const client = (networkId: string, chainId: ChainId): IClient => {
  const apiHost = getKadenaConstantByNetwork(
    networkId as DefinedNetwork,
  ).apiHost({
    networkId,
    chainId: chainId,
  });

  return createClient(apiHost);
};

export default client;
