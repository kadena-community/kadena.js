import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { describeModule } from '@kadena/client-utils';
import { useMutation } from '@tanstack/react-query';

const fetchModule = async (
  module: string,
  networkId: ChainwebNetworkId,
  chainId: ChainwebChainId,
) => {
  const describedModule = await describeModule(module, {
    defaults: { networkId, meta: { chainId } },
  });

  return {
    ...describedModule,
    chainId,
    networkId,
  };
};

export type ModuleModel = Awaited<ReturnType<typeof fetchModule>>;

const QUERY_KEY = 'module';

const useModuleQuery = () => {
  return useMutation({
    mutationFn: ({
      module,
      networkId,
      chainId,
    }: {
      module: string;
      networkId: ChainwebNetworkId;
      chainId: ChainwebChainId;
    }) => fetchModule(module, networkId, chainId),
  });
};

export { QUERY_KEY, fetchModule, useModuleQuery };
