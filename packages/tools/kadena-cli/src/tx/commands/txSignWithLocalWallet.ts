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

import {
  assessTransactionSigningStatus,
  getTransactionFromFile,
  signTransactionWithSeed,
} from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

export const signActionHd = async (
  wallet: string,
  walletConfig: IWallet,
  password: string,
  transactionfileName: string,
  signed: boolean,
  transactionDirectory: string,
): Promise<CommandResult<ICommand>> => {
  const unsignedTransaction = await getTransactionFromFile(
    transactionfileName,
    signed,
    transactionDirectory,
  );

  const seed = (await getWalletContent(wallet)) as EncryptedString;

  try {
    const command = await signTransactionWithSeed(
      walletConfig,
      seed,
      password,
      unsignedTransaction,
      walletConfig.legacy,
    );

    return assessTransactionSigningStatus(command);
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
    globalOptions.txUnsignedTransactionFile(),
  ],
  async (option) => {
    const wallet = await option.keyWallet();
    const password = await option.securityPassword();
    const dir = await option.txTransactionDir();
    const file = await option.txUnsignedTransactionFile({
      signed: false,
      path: dir.txTransactionDir,
    });

    debug.log('sign-with-local-wallet:action', {
      ...wallet,
      ...password,
      ...file,
      ...dir,
    });

    if (wallet.keyWalletConfig === null) {
      throw new Error(`Wallet: ${wallet.keyWallet} does not exist.`);
    }

    const result = await signActionHd(
      wallet.keyWallet,
      wallet.keyWalletConfig,
      password.securityPassword,
      file.txUnsignedTransactionFile,
      false,
      dir.txTransactionDir,
    );

    assertCommandError(result);

    await saveSignedTransaction(
      result.data,
      file.txUnsignedTransactionFile,
      dir.txTransactionDir,
    );

    console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
  },
);
