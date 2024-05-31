import { createClient } from '@kadena/client';
import type { Command } from 'commander';
import path from 'node:path';
import { TRANSACTIONS_LOG_FILE } from '../../../constants/config.js';
import { KadenaError } from '../../../services/service-error.js';
import { createCommand } from '../../../utils/createCommand.js';
import { notEmpty } from '../../../utils/globalHelpers.js';
import { globalOptions } from '../../../utils/globalOptions.js';
import { log } from '../../../utils/logger.js';
import { createTable } from '../../../utils/table.js';
import type {
  ITransactionLog,
  ITransactionLogEntry,
  IUpdateTransactionsLogPayload,
} from '../utils/txHelpers.js';
import {
  generateClientUrl,
  getTransactionDirectory,
  mergePayloadsWithTransactionLog,
  readTransactionLog,
  updateTransactionStatus,
} from '../utils/txHelpers.js';

const header: Record<string, string> = {
  networkHost: 'Network Host',
  networkId: 'Network ID',
  chainId: 'Chain ID',
  status: 'Status',
  txId: 'Transaction ID',
};

const filterLogsWithoutStatus = (log: ITransactionLog): ITransactionLog[] => {
  return Object.entries(log)
    .filter(([, logData]) => !logData.status)
    .map(([key, value]) => ({ [key]: value }));
};

const getTransactionStatus = async (
  requestKey: string,
  value: ITransactionLogEntry,
): Promise<IUpdateTransactionsLogPayload | undefined> => {
  const { getStatus } = createClient(
    generateClientUrl({
      networkId: value.networkId,
      chainId: value.chainId,
      networkHost: value.networkHost,
    }),
  );

  try {
    const result = await getStatus({
      requestKey,
      chainId: value.chainId,
      networkId: value.networkId,
    });

    if (result[requestKey] !== undefined) {
      return {
        requestKey,
        status: result[requestKey].result.status,
        data: result[requestKey],
      };
    }
  } catch (e) {
    log.error(
      `Failed to get transaction status for requestKey "${requestKey}": ${e.message}`,
    );
  }
};

const fetchTransactionStatuses = async (
  logs: ITransactionLog[],
): Promise<IUpdateTransactionsLogPayload[]> => {
  return await Promise.all(
    logs.map(async (logData) => {
      for (const [requestKey, value] of Object.entries(logData)) {
        const status = await getTransactionStatus(requestKey, value);
        if (status) {
          return status;
        }
      }
    }),
  ).then((results) => results.filter(notEmpty));
};

export const printTxLogs = (transactionLog: ITransactionLog): void => {
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
};

export const txHistory = async (): Promise<void> => {
  try {
    const transactionDir = getTransactionDirectory();
    if (!notEmpty(transactionDir)) throw new KadenaError('no_kadena_directory');

    const transactionFilePath = path.join(
      transactionDir,
      TRANSACTIONS_LOG_FILE,
    );
    let transactionLog = await readTransactionLog(transactionFilePath);
    if (!transactionLog)
      throw new Error(
        'No transaction logs are available. Please ensure that transaction logs are present and try again.',
      );

    const filteredLogs = filterLogsWithoutStatus(transactionLog);

    if (filteredLogs.length > 0) {
      const txResultsData = await fetchTransactionStatuses(filteredLogs);
      await updateTransactionStatus(txResultsData);
      transactionLog = mergePayloadsWithTransactionLog(
        transactionLog,
        txResultsData,
      );
    }

    printTxLogs(transactionLog);
  } catch (error) {
    log.error(`Unable to read transaction history: ${error.message}`);
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
    await txHistory();
  },
);
