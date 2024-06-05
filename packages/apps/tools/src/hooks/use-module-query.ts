import type { Optional } from '@/types/utils';
import type {
  ChainwebChainId,
  ChainwebNetworkId,
} from '@kadena/chainweb-node-client';
import { describeModule } from '@kadena/client-utils';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

export const describeModuleSchema = z.object({
  hash: z.string().optional(),
  blessed: z.array(z.string()).optional(),
  keyset: z.string().optional(),
  interfaces: z.array(z.string()).optional(),
  name: z.string(),
  code: z.string(),
});

export type DescribeModuleOutput = z.infer<typeof describeModuleSchema>;

const fetchModule = async (
  module: string,
  networkId: ChainwebNetworkId,
  chainId: ChainwebChainId,
) => {
  const describedModule = await describeModule(module, {
    defaults: { networkId, meta: { chainId } },
  });

  const parsed = describeModuleSchema.parse(describedModule);

  return {
    ...parsed,
    chainId,
    networkId,
  };
};

export type ModuleModel = Awaited<ReturnType<typeof fetchModule>>;

export type IncompleteModuleModel = Optional<ModuleModel, 'code'>;

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
