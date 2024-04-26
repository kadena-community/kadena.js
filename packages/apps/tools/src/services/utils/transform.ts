import type { IChainModule } from '@/components/Global/ModuleExplorer/types';
import type { IModulesResult } from '../modules/list-module';

export const transformModulesRequest = (
  modulesRequest: IModulesResult,
): Array<IChainModule> => {
  if (modulesRequest.data === undefined) {
    return [];
  }

  return modulesRequest.data.map((moduleName) => ({
    chainId: modulesRequest.chainId,
    moduleName,
    network: modulesRequest.network,
  }));
};
