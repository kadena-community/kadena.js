import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { listModules } from '@kadena/client-utils';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

const transformModules = (
  data: string[][],
  networkId: ChainwebNetworkId,
  chainIds?: ChainwebChainId[],
) => {
  const chains = chainIds ?? CHAINS;

  return data.flatMap((x, index) => {
    return x.map((y) => {
      return {
        name: y,
        chainId: chains[index],
        networkId,
      };
    });
  });
};

export const listModulesSchema = z.array(z.string());
export type ListModulesOutput = z.infer<typeof listModulesSchema>;

export const listsModulesSchema = z.array(listModulesSchema);
export type ListsModulesOutput = z.infer<typeof listsModulesSchema>;

const fetchModules = async (
  networkId: ChainwebNetworkId,
  chainIds?: ChainwebChainId[],
) => {
  const chains = chainIds ?? CHAINS;

  const promises = chains.map((chainId) =>
    listModules({
      defaults: { networkId, meta: { chainId } },
    }),
  );

  const results = await Promise.all(promises);

  const parsed = listsModulesSchema.parse(results);

  return transformModules(parsed, networkId, chainIds);
};

const QUERY_KEY = 'modules';

const useModulesQuery = (
  networkId: ChainwebNetworkId,
  chainIds?: ChainwebChainId[],
) => {
  return useQuery({
    queryKey: [QUERY_KEY, networkId, chainIds],
    queryFn: () => fetchModules(networkId, chainIds),
    staleTime: Infinity,
    placeholderData: [],
  });
};

export { QUERY_KEY, fetchModules, useModulesQuery };
