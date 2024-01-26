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

import {
  readKeyPairAndIndexFromFile,
  toHexStr,
} from '../../keys/utils/keysHelpers.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';
import type { ICommand } from '@kadena/types';
import { WALLET_DIR } from '../../constants/config.js';
import type { IKeyPair } from '../../keys/utils/storage.js';

export const signTransactionWithAliasFile = async (
  wallet: string,
  alias: string,
  password: string,
  transactionfileName: string,
  signed: boolean,
  transactonDirectory?: string,
  legacy?: boolean,
): Promise<CommandResult<ICommand>> => {
  try {
    const encryptedKeyPair = (await readKeyPairAndIndexFromFile(
      join(WALLET_DIR, wallet),
      alias,
    )) as IKeyPair;

    if (encryptedKeyPair === undefined) {
      throw new Error('Keypair to be used for signing not found.');
    }

    const keyPair: IKeyPair = {
      publicKey: encryptedKeyPair.publicKey,
      secretKey:
        encryptedKeyPair.secretKey !== undefined
          ? toHexStr(
              await kadenaDecrypt(
                password,
                encryptedKeyPair.secretKey as EncryptedString,
              ),
            )
          : undefined,
      index: encryptedKeyPair.index,
    };

    const unsignedCommand = await getTransactionFromFile(
      transactionfileName,
      signed,
      transactonDirectory,
    );

    if (unsignedCommand === undefined) {
      throw new Error(
        'Error signing transaction: unsigned transaction not found.',
      );
    }

    const command = await signTransactionWithKeyPair(
      [keyPair],
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
    globalOptions.securityPassword(),
    globalOptions.keyAliasSelect(),
    globalOptions.txUnsignedTransactionFile(),
    globalOptions.txTransactionDir({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (option) => {
    try {
      const wallet = await option.keyWallet();
      const password = await option.securityPassword();
      const key = await option.keyAliasSelect({
        wallet: wallet.keyWallet,
      });
      const dir = await option.txTransactionDir();
      const file = await option.txUnsignedTransactionFile({
        signed: false,
        path: dir.txTransactionDir,
      });

      const mode = await option.legacy();

      debug.log('sign-with-key-alias-file:action', {
        ...wallet,
        ...key,
        ...file,
        ...dir,
        ...mode,
      });

      const result = await signTransactionWithAliasFile(
        wallet.keyWallet,
        key.keyAliasSelect,
        password.securityPassword,
        file.txUnsignedTransactionFile,
        false,
        dir.txTransactionDir,
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
