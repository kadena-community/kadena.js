import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { saveSignedTransactions } from '../utils/storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionWithKeyPair,
} from '../utils/txHelpers.js';

import type { ICommand } from '@kadena/types';
import { join } from 'node:path';
import type { IKeyPair } from '../../keys/utils/storage.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { txOptions } from '../txOptions.js';

export const signTransactionWithKeyPairAction = async (
  keyPairs: IKeyPair[],
  /** absolute paths, or relative to process.cwd() if starting with `.` */
  transactionFileNames: string[],
  legacy?: boolean,
): Promise<CommandResult<{ commands: ICommand[]; path: string }>> => {
  const unsignedTransactions = await getTransactionsFromFile(
    transactionFileNames,
    false,
  );

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

    const path = await saveSignedTransactions(
      signedCommands,
      transactionFileNames,
    );
    if (path !== null) {
      const signed = await assessTransactionSigningStatus(signedCommands);
      if (!signed.success) return signed;

      return { success: true, data: { commands: signed.data, path } };
    } else {
      return {
        success: false,
        errors: [`Error in signAction: failed to write transaction file`],
      };
    }
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signAction: ${error.message}`],
    };
  }
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionWithKeyPairCommand: (
  program: Command,
  version: string,
) => void = createCommandFlexible(
  'sign-with-keypair',
  'Sign a transaction using a keypair.',
  [
    globalOptions.keyPairs(),
    txOptions.txTransactionDir({ isOptional: true }),
    txOptions.txUnsignedTransactionFiles(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option) => {
    const key = await option.keyPairs();
    const dir = await option.txTransactionDir();
    const files = await option.txUnsignedTransactionFiles({
      signed: false,
      path: dir.txTransactionDir,
    });
    const mode = await option.legacy();

    debug.log('sign-with-keypair:action', {
      ...key,
      ...dir,
      ...files,
      ...mode,
    });

    const result = await signTransactionWithKeyPairAction(
      key.keyPairs,
      files.txUnsignedTransactionFiles.map((file) =>
        join(dir.txTransactionDir, file),
      ),
      mode.legacy,
    );

    assertCommandError(result);

    console.log(
      chalk.green(`Signed transaction saved to ${result.data.path}.`),
    );
    console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
  },
);
