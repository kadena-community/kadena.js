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
import type { IKeyPair } from '../../keys/utils/storage.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';

export const signTransactionWithKeyPairAction = async (
  keyPairs: IKeyPair[],
  transactionfileNames: string[],
  transactionDirectory: string,
  legacy?: boolean,
): Promise<CommandResult<ICommand[]>> => {
  const unsignedTransactions = await getTransactionsFromFile(
    transactionfileNames,
    false,
    transactionDirectory,
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

    return assessTransactionSigningStatus(signedCommands);
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
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.txUnsignedTransactionFiles(),
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
      files.txUnsignedTransactionFiles,
      dir.txTransactionDir,
      mode.legacy,
    );

    assertCommandError(result);

    await saveSignedTransactions(
      result,
      files.txUnsignedTransactionFiles,
      dir.txTransactionDir,
    );

    console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
  },
);
