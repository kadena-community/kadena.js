import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type AppKda from '@ledgerhq/hw-app-kda';
import type { ISignFunction } from '../ISignFunction';
import { addSignatures } from '../utils/addSignatures';

export const createSignWithLedger = (
  client: AppKda,
  keyId = 0,
): ISignFunction => {
  const signWithLedger: ISignFunction = (async (transactionList) => {
    console.log('signWithLedger1', transactionList);
    const isList = Array.isArray(transactionList);
    const transactions = isList ? transactionList : [transactionList];

    const sigPromises = transactions.map((tx) => {
      const bufferCmd = new TextEncoder().encode(tx.cmd);
      return client.signTransaction(`m/44'/626'/${keyId}'/0/0`, bufferCmd);
    });

    const signatures = await Promise.all(sigPromises);

    console.log('signWithLedger2', signatures);

    const singedTransactions = transactions.map((transaction, index) => {
      // client.signHash();
      const { signature: sigBuffer } = signatures[index];
      const signature = (sigBuffer as Buffer).toString('hex');
      // const signature = sigBuffer.toString();
      const signedCommand = addSignatures(transaction, {
        sig: signature,
        // pubKey?: string
      });

      return signedCommand;
    });

    console.log('signWithLedger3', singedTransactions);

    return isList ? singedTransactions : singedTransactions[0];
  }) as ISignFunction;

  return signWithLedger;
};
