import chalk from 'chalk';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { saveSignedTransaction } from '../utils/storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionFromFile,
  signTransactionWithKeyPair,
} from '../utils/txHelpers.js';

import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletKey, toHexStr } from '../../keys/utils/keysHelpers.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';
import type { ICommand } from '@kadena/types';
import type { IKeyPair } from '../../keys/utils/storage.js';

export const signTransactionWithAliasFile = async (
  wallet: IWallet,
  alias: string,
  password: string,
  transactionfileName: string,
  signed: boolean,
  transactionDirectory?: string,
  legacy?: boolean,
): Promise<CommandResult<ICommand>> => {
  try {
    const encryptedKeyPair = await getWalletKey(wallet, alias);

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
      transactionDirectory,
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
    const wallet = await option.keyWallet();
    if (!wallet.keyWalletConfig) throw new Error('wallet not found');

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
      wallet.keyWalletConfig,
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
  },
);
