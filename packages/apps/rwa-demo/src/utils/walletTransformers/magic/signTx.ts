import type { IUnsignedCommand } from '@kadena/client';

import { KadenaExtension } from '@magic-ext/kadena';
import { magicInit } from './utils';

export const magicSignTx = async (tx: IUnsignedCommand) => {
  const magic = magicInit();

  const { transactions } = await (
    magic.kadena as KadenaExtension
  ).signTransactionWithSpireKey(tx);

  if (transactions.length === 0) return;

  const transaction = transactions[0];
  const cmd = JSON.parse(transaction.cmd);

  const signatures = transaction.sigs.map((sig, idx) => {
    const signer = cmd.signers[idx];
    return { pubkey: signer.pubKey, sig: sig };
  });

  return transaction;
};
