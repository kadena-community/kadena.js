import { IExecPayload, IPactCommand } from './IPactCommand';

export function isExecCommand(
  parsedTransaction: IPactCommand,
): parsedTransaction is IPactCommand & { payload: IExecPayload } {
  return 'code' in parsedTransaction.payload;
}
