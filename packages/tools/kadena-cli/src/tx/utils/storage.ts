import type { ICommand } from '@kadena/types';
import chalk from 'chalk';
import { join } from 'node:path';
import { TRANSACTION_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { formatDate } from '../../tx/utils/helpers.js';

/**
 * Saves the signed transaction in the transactions directory.
 *
 * @param {Object} transactionData
 * @param {string} originalFilename
 */
export async function saveSignedTransaction(
  transactionData: ICommand,
  originalFilename: string,
): Promise<void> {
  const dateSuffix = formatDate();
  const newFilename = `${originalFilename}-${dateSuffix}-signed.json`;

  const filePath = join(TRANSACTION_DIR, newFilename);

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
