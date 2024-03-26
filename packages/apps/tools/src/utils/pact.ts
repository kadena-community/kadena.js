import type { ICommandResult } from '@kadena/chainweb-node-client';

export const isCrossChainRequest = (request: ICommandResult): boolean => {
  return request.continuation !== null && request.continuation.yield !== null;
};
