import type { ICommand, IUnsignedCommand } from '@kadena/client';
import type { KadenaExtension } from '@magic-ext/kadena';
import { magicInit } from './utils';

export const magicSignTx = async (tx: IUnsignedCommand) => {
  const magic = magicInit();

  const { transactions } = await (
    magic.kadena as KadenaExtension
  ).signTransactionWithSpireKey(tx);

  const transaction = transactions[0];

  return transaction as ICommand;
};
