import type { Command } from 'commander';
import path from 'node:path';
import { TRANSACTIONS_LOG_FILE } from '../../constants/config.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { notEmpty } from '../../utils/globalHelpers.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';
import {
  getTransactionDirectory,
  readTransactionLog,
} from '../utils/txHelpers.js';

const header: Record<string, string> = {
  hash: 'Hash',
  network: 'Network',
  networkId: 'Network ID',
  chainId: 'Chain ID',
  status: 'Status',
  gas: 'Gas',
  txId: 'Transaction ID',
  logs: 'Logs',
};

export const printTxHistory = async (): Promise<void> => {
  try {
    const transactionDir = getTransactionDirectory();
    if (!notEmpty(transactionDir)) throw new KadenaError('no_kadena_directory');

    const transactionFilePath = path.join(
      transactionDir,
      TRANSACTIONS_LOG_FILE,
    );
    const transactionLog = await readTransactionLog(transactionFilePath);
    if (!transactionLog) throw new Error('no_transaction_data');

    const table = createTable({});
    Object.entries(transactionLog).forEach(([requestKey, data]) => {
      table.push([{ colSpan: 2, content: `Request Key: ${requestKey}` }]);
      Object.entries(data).forEach(([key, value]) => {
        const headerKey = header[key] || key;
        table.push({
          [log.color.green(headerKey)]: value?.toString() ?? 'N/A',
        });
      });
      table.push([{ colSpan: 2, content: '' }]);
    });

    log.output(table.toString(), transactionLog);
  } catch (error) {
    log.error(`Failed to read transaction history: ${error.message}`);
  }
};

export const createTxHistoryCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'history',
  'Output a formatted list of transactions with their details, making it easy for users to understand their transaction history.',
  [globalOptions.directory({ disableQuestion: true })],
  async () => {
    log.debug('tx-history:action');
    await printTxHistory();
  },
);
