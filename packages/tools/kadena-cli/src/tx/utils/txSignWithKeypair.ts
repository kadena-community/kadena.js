import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';

import type { IKeyPair } from '../../keys/utils/storage.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { log } from '../../utils/logger.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionWithKeyPair,
} from './txHelpers.js';

export const signTransactionWithKeyPairAction = async ({
  commands: unsignedTransactions,
  keyPairs,
  legacy,
  directory,
}: {
  keyPairs: IKeyPair[];
  commands: IUnsignedCommand[];
  directory?: string;
  legacy?: boolean;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  if (unsignedTransactions.length === 0) {
    return {
      success: false,
      errors: ['No unsigned transactions found.'],
    };
  }

  try {
    const signedCommands = await signTransactionWithKeyPair(
      keyPairs,
      unsignedTransactions,
      legacy,
    );

    const savedTransactions = await saveSignedTransactions(
      signedCommands,
      directory,
    );

    const signingStatus = await assessTransactionSigningStatus(signedCommands);
    if (!signingStatus.success) return signingStatus;

    return {
      success: true,
      data: {
        commands: savedTransactions.map((tx) => ({
          command: tx.command as ICommand,
          path: tx.filePath,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signAction: ${error.message}`],
    };
  }
};

export const signTransactionFileWithKeyPairAction = async (data: {
  keyPairs: IKeyPair[];
  files: string[];
  legacy?: boolean;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  return signTransactionWithKeyPairAction({
    ...data,
    commands: await getTransactionsFromFile(data.files, false),
  });
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export async function signWithKeypair(option, values, stdin): Promise<void> {
  const key = await option.keyPairs();
  const mode = await option.legacy();

  const result = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      log.debug('sign-with-keypair:action', {
        ...key,
        ...mode,
        command,
      });
      return await signTransactionWithKeyPairAction({
        commands: [command],
        keyPairs: key.keyPairs,
        legacy: mode.legacy,
      });
    } else {
      const { directory } = await option.directory();
      const files = await option.txUnsignedTransactionFiles({
        signed: false,
        path: directory,
      });
      const absolutePaths = files.txUnsignedTransactionFiles.map((file) =>
        path.resolve(path.join(directory, file)),
      );
      log.debug('sign-with-keypair:action', {
        ...key,
        directory,
        ...files,
        ...mode,
      });
      return await signTransactionFileWithKeyPairAction({
        files: absolutePaths,
        keyPairs: key.keyPairs,
        legacy: mode.legacy,
      });
    }
  })();

  assertCommandError(result);

  if (result.data.commands.length === 1) {
    log.output(JSON.stringify(result.data.commands[0], null, 2));
  }
  result.data.commands.forEach((tx) => {
    log.info(`Signed transaction saved to ${tx.path}`);
  });
}
