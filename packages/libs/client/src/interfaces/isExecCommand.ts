import { IExecPayloadObject, IPactCommand } from './IPactCommand';

export function isExecCommand(
  parsedTransaction: IPactCommand,
): parsedTransaction is IPactCommand & { payload: IExecPayloadObject } {
  return 'exec' in parsedTransaction.payload;
}
