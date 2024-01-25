import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { removeAfterFirstDot } from '../../utils/path.util.js';
import {
  assessTransactionSigningStatus,
  getTransactionFromFile,
  signTransactionWithSeed,
} from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

export const signActionHd = async (
  walletName: string,
  wallet: EncryptedString,
  password: string,
  unsignedCommand: IUnsignedCommand,
  legacy?: boolean,
): Promise<CommandResult<ICommand>> => {
  try {
    const command = await signTransactionWithSeed(
      walletName,
      wallet,
      password,
      unsignedCommand,
      legacy,
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
    try {
      const keyWalletObj = await option.keyWallet();
      const password = await option.securityPassword();
      const dir = await option.txTransactionDir();
      const file = await option.txUnsignedTransactionFile({
        signed: false,
        path: dir.txTransactionDir,
      });

      debug.log('sign-with-local-wallet:action', {
        ...keyWalletObj,
        ...password,
        ...file,
        ...dir,
      });

      const txUnsignedTransaction = await getTransactionFromFile(
        file.txUnsignedTransactionFile,
        false,
        dir.txTransactionDir,
      );

      const wallet =
        typeof keyWalletObj.keyWallet === 'string'
          ? keyWalletObj.keyWallet
          : keyWalletObj.keyWallet.wallet;

      const walletName =
        typeof keyWalletObj.keyWallet === 'string'
          ? keyWalletObj.keyWallet
          : removeAfterFirstDot(keyWalletObj.keyWallet.fileName);

      const decryptedMessage = await kadenaDecrypt(
        password.securityPassword,
        wallet as EncryptedString,
      );
      const isLegacy = decryptedMessage.byteLength >= 128;

      const result = await signActionHd(
        walletName,
        wallet as EncryptedString,
        password.securityPassword,
        txUnsignedTransaction,
        isLegacy,
      );

      assertCommandError(result);

      await saveSignedTransaction(
        result.data,
        file.txUnsignedTransactionFile,
        dir.txTransactionDir,
      );

      console.log(chalk.green(`\nTransaction withinsigned successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
