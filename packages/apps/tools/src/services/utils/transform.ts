import type { IModulesResult } from '../modules/list-module';

import type { IModule } from '@/components/Global';

export const transformModulesRequest = (
  modulesRequest: IModulesResult,
): Array<IModule> => {
  if (!modulesRequest.data) {
    return [];
  }

  return modulesRequest.data.map((moduleName) => ({
    chainId: modulesRequest.chainId,
    moduleName,
  }));
};
