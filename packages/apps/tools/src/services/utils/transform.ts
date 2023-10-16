import type { IModulesResult } from '../modules/list-module';

import type { IChainModule } from '@/components/Global/ModuleExplorer/types';

export const transformModulesRequest = (
  modulesRequest: IModulesResult,
): Array<IChainModule> => {
  if (modulesRequest.data === undefined) {
    return [];
  }

  return modulesRequest.data.map((moduleName) => ({
    chainId: modulesRequest.chainId,
    moduleName,
  }));
};
