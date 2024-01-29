import type { ICommand } from '@kadena/types';
import chalk from 'chalk';
import { join } from 'node:path';
import { TRANSACTION_PATH } from '../../constants/config.js';
import { services } from '../../services/index.js';
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
