import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';

import type { IWalletKeyPair } from '../../../services/wallet/wallet.types.js';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';
import type { CommandOption } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  processSigningStatus,
  signTransactionWithKeyPair,
} from './txHelpers.js';

export const signTransactionWithKeyPairAction = async ({
  commands: unsignedTransactions,
  keyPairs,
  directory,
}: {
  keyPairs: IWalletKeyPair[];
  commands: IUnsignedCommand[];
  directory?: string;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  if (unsignedTransactions.length === 0) {
    return {
      status: 'error',
      errors: ['No unsigned transactions found.'],
    };
  }

  try {
    const signedCommands = await signTransactionWithKeyPair(
      keyPairs,
      unsignedTransactions,
    );

    const savedTransactions = await saveSignedTransactions(
      signedCommands,
      directory,
    );

    const signingStatus = await assessTransactionSigningStatus(signedCommands);

    return processSigningStatus(savedTransactions, signingStatus);
  } catch (error) {
    return {
      status: 'error',
      errors: [`Error in signAction: ${error.message}`],
    };
  }
};

export const signTransactionFileWithKeyPairAction = async (data: {
  keyPairs: IWalletKeyPair[];
  files: string[];
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
export async function signWithKeypair(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  const key = await option.keyPairs();

  const result = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      log.debug('sign-with-keypair:action', {
        ...key,
        command,
      });

      return await signTransactionWithKeyPairAction({
        commands: [command],
        keyPairs: key.keyPairs.map((x) => ({
          publicKey: x.publicKey,
          secretKey: x.secretKey!,
        })),
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
      });
      return await signTransactionFileWithKeyPairAction({
        files: absolutePaths,
        keyPairs: key.keyPairs.map((x) => ({
          publicKey: x.publicKey,
          secretKey: x.secretKey!,
        })),
      });
    }
  })();

  assertCommandError(result);

  if (result.data.commands.length === 1) {
    log.output(
      JSON.stringify(result.data.commands[0].command, null, 2),
      result.data.commands[0].command,
    );
  }
  result.data.commands.forEach((tx) => {
    log.info(`Signed transaction saved to ${tx.path}`);
  });
}
