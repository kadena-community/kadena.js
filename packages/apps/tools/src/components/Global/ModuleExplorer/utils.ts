import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import type { IModule } from '@/pages/transactions/module-explorer/new';

export const getModulesMap = (
  modules: IModule[],
): Map<string, ChainwebChainId[]> => {
  const modulesMap = new Map();

  modules.forEach((module) => {
    if (modulesMap.has(module.moduleName)) {
      modulesMap.set(module.moduleName, [
        ...modulesMap.get(module.moduleName),
        module.chainId,
      ]);
    } else {
      modulesMap.set(module.moduleName, [module.chainId]);
    }
  });

  return modulesMap;
};
