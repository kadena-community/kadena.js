import type { Network } from '@/constants/kadena';
import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { IChainModule } from './types';

export const getModulesMap = (
  modules: IChainModule[],
): Map<
  string,
  Array<{
    chainId: ChainwebChainId;
    hash?: string;
    code?: string;
    network: Network;
  }>
> => {
  const modulesMap = new Map<
    string,
    Array<{
      chainId: ChainwebChainId;
      hash?: string;
      code?: string;
      network: Network;
    }>
  >();

  modules.forEach((module) => {
    if (modulesMap.has(module.moduleName)) {
      modulesMap.set(module.moduleName, [
        ...modulesMap.get(module.moduleName)!,
        {
          chainId: module.chainId,
          hash: module.hash,
          code: module.code,
          network: module.network,
        },
      ]);
    } else {
      modulesMap.set(module.moduleName, [
        {
          chainId: module.chainId,
          hash: module.hash,
          code: module.code,
          network: module.network,
        },
      ]);
    }
  });

  return modulesMap;
};
