import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { CHAINS } from '@kadena/chainweb-node-client';
import { listModules } from '@kadena/client-utils';
import { useQuery } from '@tanstack/react-query';

const transformModules = (data: string[][], chainIds?: ChainwebChainId[]) => {
  const chains = chainIds ?? CHAINS;

  return data.flatMap((x, index) => {
    return x.map((y) => {
      return {
        name: y,
        chainId: chains[index],
      };
    });
  });
};

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

  return transformModules(results, chainIds);
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
  });
};

export { QUERY_KEY, fetchModules, useModulesQuery };
