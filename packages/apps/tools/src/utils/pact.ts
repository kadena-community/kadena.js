import type { ICommandResult } from '@kadena/chainweb-node-client';
import type { IPactExec } from '@kadena/types';

export const isContinuationResponse = (
  continuation: ICommandResult['continuation'],
): continuation is IPactExec => {
  return continuation !== null;
};

export const isCrossChainResponse = (response: ICommandResult): boolean => {
  return (
    isContinuationResponse(response.continuation) &&
    response.continuation.yield !== null
  );
};
