import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { join, parse } from 'node:path';
import { services } from '../../services/index.js';
import { formatDate, isPartiallySignedTransaction } from './txHelpers.js';

/**
 * Saves multiple signed transactions
 *
 * @param {TransactionResult} result
 * @param {string[]} transactionFileNames
 * @returns {Promise<void>}
 * @throws {Error}
 */
export async function saveSignedTransactions(
  commands: (ICommand | IUnsignedCommand)[],
  /** absolute paths, or relative to process.cwd() if starting with `.` */
  transactionFileNames: string[],
): Promise<string | null> {
  if (commands !== undefined && commands.length > 0) {
    for (let index = 0; index < commands.length; index++) {
      const transactionData = commands[index];
      const isPartial = isPartiallySignedTransaction(transactionData);
      try {
        if (index < transactionFileNames.length) {
          const originalPath = parse(transactionFileNames[index]);
          const originalFilename = originalPath.name;
          const dateSuffix = formatDate();
          const state = isPartial ? 'partial' : 'signed';
          const writeFilePath = join(
            originalPath.dir,
            `${originalFilename}-tx-${index}-${dateSuffix}-${state}.json`,
          );
          await services.filesystem.writeFile(
            writeFilePath,
            JSON.stringify(transactionData, null, 2),
          );
          return writeFilePath;
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
  return null;
}
