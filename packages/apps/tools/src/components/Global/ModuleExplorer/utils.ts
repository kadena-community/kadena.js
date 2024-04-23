import type { ChainwebChainId } from '@kadena/chainweb-node-client';
import type { IChainModule } from './types';

export const getModulesMap = (
  modules: IChainModule[],
): Map<
  string,
  Array<{ chainId: ChainwebChainId; hash?: string; code?: string }>
> => {
  const modulesMap = new Map<
    string,
    Array<{ chainId: ChainwebChainId; hash?: string; code?: string }>
  >();

  modules.forEach((module) => {
    if (modulesMap.has(module.moduleName)) {
      modulesMap.set(module.moduleName, [
        ...modulesMap.get(module.moduleName)!,
        { chainId: module.chainId, hash: module.hash, code: module.code },
      ]);
    } else {
      modulesMap.set(module.moduleName, [
        { chainId: module.chainId, hash: module.hash, code: module.code },
      ]);
    }
  });

  return modulesMap;
};
