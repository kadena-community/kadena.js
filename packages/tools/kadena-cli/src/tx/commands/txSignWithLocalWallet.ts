import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { ICommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletContent } from '../../keys/utils/keysHelpers.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';

import { saveSignedTransactions } from '../utils/storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionsWithSeed,
} from '../utils/txHelpers.js';

export const signTransactionWithLocalWallet = async (
  wallet: string,
  walletConfig: IWallet,
  password: string,
  transactionfileNames: string[],
  signed: boolean,
  transactionDirectory: string,
): Promise<CommandResult<ICommand[]>> => {
  const unsignedTransactions = await getTransactionsFromFile(
    transactionfileNames,
    signed,
    transactionDirectory,
  );

  if (unsignedTransactions.length === 0) {
    return {
      success: false,
      errors: ['No unsigned transactions found.'],
    };
  }

  const seed = (await getWalletContent(wallet)) as EncryptedString;

  try {
    const signedCommands = await signTransactionsWithSeed(
      walletConfig,
      seed,
      password,
      unsignedTransactions,
      walletConfig.legacy,
    );

    return assessTransactionSigningStatus(signedCommands);
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signTransactionWithLocalWallet: ${error.message}`],
    };
  }
};

/**
 * Creates a command for signing a Kadena transaction.
 *
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the command.
 */
export const createSignTransactionWithLocalWalletCommand: (
  program: Command,
  version: string,
) => void = createCommandFlexible(
  'sign-with-local-wallet',
  'Sign a transaction using your local  wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.securityPassword(),
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.txUnsignedTransactionFiles(),
  ],
  async (option) => {
    const wallet = await option.keyWallet();
    const password = await option.securityPassword();
    const dir = await option.txTransactionDir();
    const files = await option.txUnsignedTransactionFiles({
      signed: false,
      path: dir.txTransactionDir,
    });

    debug.log('sign-with-local-wallet:action', {
      ...wallet,
      ...password,
      ...files,
      ...dir,
    });

    if (wallet.keyWalletConfig === null) {
      throw new Error(`Wallet: ${wallet.keyWallet} does not exist.`);
    }

    const result = await signTransactionWithLocalWallet(
      wallet.keyWallet,
      wallet.keyWalletConfig,
      password.securityPassword,
      files.txUnsignedTransactionFiles,
      false,
      dir.txTransactionDir,
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
