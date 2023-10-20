import { isSignedTransaction } from '@kadena/client';
import { sign } from '@kadena/cryptography-utils';
import { ICommand, IKeyPair, IUnsignedCommand } from '@kadena/types';

export const signTransaction = (
  transaction: IUnsignedCommand,
  { secretKey, publicKey }: IKeyPair,
): ICommand => {
  const signature1 = sign(transaction.cmd, {
    publicKey,
    secretKey,
  });

  if (signature1.sig === undefined) {
    throw new Error('Failed to sign transaction');
  }

  transaction.sigs = [{ sig: signature1.sig }];

  if (!isSignedTransaction(transaction)) {
    throw new Error('Transaction is not signed');
  }

  return transaction;
};
