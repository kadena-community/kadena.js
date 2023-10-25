import { isSignedTransaction } from '@kadena/client';
import type { ICommand, IUnsignedCommand } from '@kadena/types';

export const inspect =
  <T extends any>(tag: string) =>
  (data: T): T => {
    console.log(tag, data);
    return data;
  };

export const validateSign = (
  tx: IUnsignedCommand,
  signedTx: ICommand | IUnsignedCommand,
): ICommand => {
  const { sigs, hash } = signedTx;
  const txWithSigs = { ...tx, sigs };
  if (txWithSigs.hash !== hash) {
    throw new Error('Hash mismatch');
  }
  if (!isSignedTransaction(txWithSigs)) {
    throw new Error('Signing failed');
  }
  return txWithSigs;
};

export const safeSign =
  (
    sign: (
      transaction: IUnsignedCommand,
    ) => Promise<IUnsignedCommand | ICommand>,
  ) =>
  async (tx: IUnsignedCommand) => {
    if (tx.sigs.length === 0) return tx as ICommand;
    const signedTx = await sign(tx);
    return validateSign(tx, signedTx);
  };
