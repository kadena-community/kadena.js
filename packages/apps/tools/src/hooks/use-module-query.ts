import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { describeModule } from '@kadena/client-utils';
import { useQuery } from '@tanstack/react-query';

const fetchModule = (
  module: string,
  networkId: ChainwebNetworkId,
  chainId: ChainwebChainId,
) => {
  const describedModule = describeModule(module, {
    defaults: { networkId, meta: { chainId } },
  });

  return describedModule;
};

const QUERY_KEY = 'module';

const useModuleQuery = (
  module: string,
  networkId: ChainwebNetworkId,
  chainId: ChainwebChainId,
) => {
  return useQuery({
    queryKey: [QUERY_KEY, module, networkId, chainId],
    queryFn: () => fetchModule(module, networkId, chainId),
  });
};

export { QUERY_KEY, fetchModule, useModuleQuery };
