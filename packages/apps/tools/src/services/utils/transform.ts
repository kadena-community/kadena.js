import type { IModulesResult } from '../modules/list-module';

import type { IModule } from '@/components/Global';

export const transformModulesRequest = (
  modulesRequest: IModulesResult,
): Array<IModule> => {
  if (!modulesRequest || modulesRequest.data === undefined) {
    return [];
  }

  return modulesRequest.data.map((moduleName) => ({
    chainId: modulesRequest.chainId,
    moduleName,
  }));
};
