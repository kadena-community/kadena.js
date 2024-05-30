import type { ICommand, IUnsignedCommand } from '@kadena/types';
import path from 'node:path';
import { WORKING_DIRECTORY } from '../../../constants/config.js';
import { services } from '../../../services/index.js';
import { isPartiallySignedTransaction } from './txHelpers.js';

export interface ISavedTransaction {
  command: ICommand | IUnsignedCommand;
  filePath: string;
  state: string;
}

/**
 * Saves multiple signed transactions
 */
export async function saveSignedTransactions(
  commands: (ICommand | IUnsignedCommand)[],
  directory?: string,
): Promise<ISavedTransaction[]> {
  const result: ISavedTransaction[] = [];
  for (let index = 0; index < commands.length; index++) {
    const command = commands[index];

    const isPartial = isPartiallySignedTransaction(command);
    const state = isPartial ? 'partial' : 'signed';
    const fileDir = directory ?? WORKING_DIRECTORY;
    const filePath = path.join(
      fileDir,
      `transaction-${command.hash.slice(0, 10)}-${state}.json`,
    );

    await services.filesystem.writeFile(
      filePath,
      JSON.stringify(command, null, 2),
    );
    result.push({ command, filePath, state });
  }
  return result;
}
