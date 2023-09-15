import type { ChainwebChainId } from '@kadena/chainweb-node-client';

import type { IModulesResult } from '../modules/list-module';

export const transformModulesRequest = (
  modulesRequest: IModulesResult,
): Array<{ chainId: ChainwebChainId; moduleName: string }> => {
  if (!modulesRequest.data) {
    return [];
  }

  return modulesRequest.data.map((moduleName) => ({
    chainId: modulesRequest.chainId,
    moduleName,
  }));
};
