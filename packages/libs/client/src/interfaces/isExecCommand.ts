import {
  type IExecutionPayloadObject,
  type IPactCommand,
} from './IPactCommand';

/**
 * @internal
 */
export function isExecCommand(
  parsedTransaction: IPactCommand,
): parsedTransaction is IPactCommand & { payload: IExecutionPayloadObject } {
  return 'exec' in parsedTransaction.payload;
}
