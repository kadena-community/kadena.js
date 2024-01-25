import chalk from 'chalk';
import debug from 'debug';
import { join } from 'path';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';

import {
  assessTransactionSigningStatus,
  getTransactionFromFile,
  signTransactionWithKeyPair,
} from '../utils/helpers.js';
import { saveSignedTransaction } from '../utils/storage.js';

import { readKeyPairAndIndexFromFile } from '../../keys/utils/keysHelpers.js';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { WALLET_DIR } from '../../constants/config.js';
import type { IKeyPair } from '../../keys/utils/storage.js';
import { removeAfterFirstDot } from '../../utils/path.util.js';

export const signActionPlain = async (
  unsignedCommand: IUnsignedCommand,
  keyPairs: IKeyPair[],
  legacy?: boolean,
): Promise<CommandResult<ICommand>> => {
  try {
    if (keyPairs.length === 0) {
      throw new Error('Error signing transaction: no keys found.');
    }
    const command = await signTransactionWithKeyPair(
      keyPairs,
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

export const createSignTransactionWithAliasFileCommand = createCommandFlexible(
  'sign-with-alias-file',
  'Sign a transaction using your local aliased file containing your keypair.',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.keyAliasSelect(),
    globalOptions.txUnsignedTransactionFile(),
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option) => {
    try {
      const wallet = await option.keyWallet();

      const walletName =
        typeof wallet.keyWallet === 'string'
          ? wallet.keyWallet
          : removeAfterFirstDot(wallet.keyWallet.fileName);

      const key = await option.keyAliasSelect({
        wallet: walletName,
      });
      const dir = await option.txTransactionDir();
      const file = await option.txUnsignedTransactionFile({
        signed: false,
        path: dir.txTransactionDir,
      });
      const mode = await option.legacy();

      debug.log('create-transaction:action', {
        ...wallet,
        ...key,
        ...file,
        ...dir,
        ...mode,
      });

      const keyPair = await readKeyPairAndIndexFromFile(
        join(WALLET_DIR, walletName),
        key.keyAliasSelect,
      );

      if (keyPair === undefined) {
        throw new Error('Error signing transaction: key pair not found.');
      }

      const unsignedCommand = await getTransactionFromFile(
        file.txUnsignedTransactionFile,
        false,
        dir.txTransactionDir,
      );

      console.log('command: ', unsignedCommand);

      if (unsignedCommand === undefined) {
        throw new Error(
          'Error signing transaction: unsigned transaction not found.',
        );
      }

      const result = await signActionPlain(
        unsignedCommand,
        [keyPair],
        mode.legacy,
      );

      assertCommandError(result);

      await saveSignedTransaction(
        result.data,
        file.txUnsignedTransactionFile,
        dir.txTransactionDir,
      );

      console.log(chalk.green(`\nTransaction signed successfully.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
