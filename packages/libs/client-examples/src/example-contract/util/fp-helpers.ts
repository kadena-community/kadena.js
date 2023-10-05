import type { ICommandResult } from '@kadena/client';
import { isSignedTransaction } from '@kadena/client';
import type { ICommand, IUnsignedCommand } from '@kadena/types';

// export const head = (args: all[]): any => args[0];

export const inspect =
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (tag: string) =>
  <T extends any>(data: T): T => {
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

export const safeSign =
  // prettier-ignore
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  (
    sign: (
      transaction: IUnsignedCommand,
    ) => Promise<IUnsignedCommand | ICommand>,
  ) =>
  async (tx: IUnsignedCommand) => {
    const signedTx = await sign(tx);
    return validateSign(tx, signedTx);
  };

// throw if the result is failed ; we might introduce another api for error handling
export const throwIfFails = (response: ICommandResult): ICommandResult => {
  if (response.result.status === 'success') {
    return response;
  }
  throw response.result.error;
};
