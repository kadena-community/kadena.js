import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { listModules } from '@kadena/client-utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

export const schema = z.array(z.string());

export type Modules = z.infer<typeof schema>;

const fetchModules = (
  networkId: ChainwebNetworkId,
  chainIds?: ChainwebChainId[],
) => {
  const chains = chainIds ?? CHAINS;

  const promises = chains.map((chainId) =>
    listModules({
      defaults: { networkId, meta: { chainId } },
    }),
  );

  return Promise.all(promises);
};

const useModulesQuery = (
  networkId: ChainwebNetworkId,
  chainIds?: ChainwebChainId[],
) => {
  return useQuery({
    queryKey: ['modules', networkId, chainIds],
    queryFn: () => fetchModules(networkId, chainIds),
  });
};

export { fetchModules, useModulesQuery };
