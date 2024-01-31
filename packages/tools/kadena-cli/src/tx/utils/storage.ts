import type { ICommand } from '@kadena/types';
import chalk from 'chalk';
import { join } from 'node:path';
import { TRANSACTION_PATH } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { formatDate } from './txHelpers.js';

/**
 * Saves the signed transaction in the transactions directory.
 *
 * @param {Object} transactionData
 * @param {string} originalFilename
 */
export async function saveSignedTransaction(
  transactionData: ICommand,
  originalFilename: string,
  transactionDir?: string,
): Promise<void> {
  const dateSuffix = formatDate();
  const newFilename = `${originalFilename}-${dateSuffix}-signed.json`;

  const storagePath =
    transactionDir !== undefined
      ? `${process.cwd()}/${transactionDir}`
      : TRANSACTION_PATH;

  const filePath = join(storagePath, newFilename);

  try {
    await services.filesystem.ensureDirectoryExists(filePath);
    await services.filesystem.writeFile(
      filePath,
      JSON.stringify(transactionData, null, 2),
    );
    console.log(chalk.green(`Signed transaction saved to ${filePath}`));
  } catch (error) {
    console.error(`Error saving signed transaction:`, error);
    throw error;
  }
}

/**
 * Saves multiple signed transactions
 *
 * @param {TransactionResult} result
 * @param {string[]} transactionFileNames
 * @param {string} transactionDir
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function saveSignedTransactions(
  result: CommandResult<ICommand[]>,
  transactionFileNames: string[],
  transactionDir: string,
): Promise<void> {
  if (result.success && result.data !== undefined && result.data.length > 0) {
    for (let index = 0; index < result.data.length; index++) {
      const transactionData = result.data[index];
      try {
        if (index < transactionFileNames.length) {
          const originalFilename = transactionFileNames[index];
          const modifiedFilename = `${originalFilename}-tx-${index}`;
          await saveSignedTransaction(
            transactionData,
            modifiedFilename,
            transactionDir,
          );
        } else {
          console.error(
            `Error: No corresponding filename for transaction at index ${index}.`,
          );
        }
      } catch (error) {
        console.error(`Error saving transaction at index ${index}:`, error);
      }
    }
  } else {
    console.error('Error: Transaction signing was unsuccessful.');
  }
}
