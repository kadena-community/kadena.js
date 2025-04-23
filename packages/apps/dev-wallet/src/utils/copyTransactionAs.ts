import { ITransaction } from '@/modules/transaction/transaction.repository';
import yaml from 'js-yaml';
import { normalizeTx } from './normalizeSigs';

export const copyTransactionAs =
  (format: 'json' | 'yaml', transaction: ITransaction, legacySig = false) =>
  () => {
    const tx = {
      hash: transaction.hash,
      cmd: transaction.cmd,
      sigs: transaction.sigs,
    };
    const transactionData = legacySig ? normalizeTx(tx) : tx;

    let formattedData: string;
    if (format === 'json') {
      formattedData = JSON.stringify(transactionData, null, 2);
    } else {
      formattedData = yaml.dump(transactionData);
    }

    navigator.clipboard.writeText(formattedData);
  };
