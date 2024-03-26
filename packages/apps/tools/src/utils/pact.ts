import type { ICommandResult } from '@kadena/chainweb-node-client';

export const isCrossChainResponse = (response: ICommandResult): boolean => {
  return response.continuation !== null && response.continuation.yield !== null;
};
