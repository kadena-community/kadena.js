import type { ICommandResult } from '@kadena/client';
import { isSignedTransaction, signWithChainweaver } from '@kadena/client';
import { asyncPipe } from '@kadena/client/fp';
import type { ICommand, IUnsignedCommand } from '@kadena/types';

export const inspect =
  (tag: string): (<T extends unknown>(data: T) => T) =>
  <T extends unknown>(data: T): T => {
    console.log(tag, data);
    return data;
  };

export const validateSign = (
  tx: IUnsignedCommand,
  signedTx: ICommand | IUnsignedCommand,
): ICommand => {
  const { sigs, hash } = signedTx;
  const txWidthSigs = { ...tx, sigs };
  if (txWidthSigs.hash !== hash) {
    throw new Error('Hash mismatch');
  }
  if (!isSignedTransaction(txWidthSigs)) {
    throw new Error('Signing failed');
  }
  return txWidthSigs;
};

export const safeSigned = async (tx: IUnsignedCommand): Promise<ICommand> => {
  const signedTx = await signWithChainweaver(tx);
  return validateSign(tx, signedTx);
};

// throw if the result is failed ; we might introduce another api for error handling
export const throwIfFailed = (response: ICommandResult): ICommandResult => {
  if (response.result.status === 'success') {
    return response;
  }
  throw response.result.error;
};

// run preflight and return the tx if its successful
export const checkSuccess =
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
  <T extends (...args: any) => any>(preflight: T) =>
    (tx: ICommand) =>
      asyncPipe(preflight, throwIfFailed, () => tx)(tx);
