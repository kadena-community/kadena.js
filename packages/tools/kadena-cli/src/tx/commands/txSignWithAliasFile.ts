import chalk from 'chalk';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { saveSignedTransactions } from '../utils/storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionWithKeyPair,
} from '../utils/txHelpers.js';

import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletKey, toHexStr } from '../../keys/utils/keysHelpers.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';
import type { ICommand } from '@kadena/types';
import { join } from 'node:path';
import type { IKeyPair } from '../../keys/utils/storage.js';
import { txOptions } from '../txOptions.js';

export const signTransactionWithAliasFile = async (
  wallet: IWallet,
  alias: string,
  password: string,
  /** absolute paths, or relative to process.cwd() if starting with `.` */
  transactionFileNames: string[],
  signed: boolean,
  legacy?: boolean,
): Promise<CommandResult<{ commands: ICommand[]; path: string }>> => {
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

    const unsignedTransactions = await getTransactionsFromFile(
      transactionFileNames,
      signed,
    );

    if (unsignedTransactions.length === 0) {
      return {
        success: false,
        errors: ['No unsigned transactions found.'],
      };
    }

    const commands = await signTransactionWithKeyPair(
      [keyPair],
      unsignedTransactions,
      legacy,
    );

    const path = await saveSignedTransactions(commands, transactionFileNames);

    const signingStatus = await assessTransactionSigningStatus(commands);
    if (!signingStatus.success) return signingStatus;

    return { success: true, data: { commands: signingStatus.data, path } };
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
    txOptions.txUnsignedTransactionFiles(),
    txOptions.txTransactionDir({ isOptional: true }),
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
    const files = await option.txUnsignedTransactionFiles({
      signed: false,
      path: dir.txTransactionDir,
    });

    const mode = await option.legacy();

    debug.log('sign-with-key-alias-file:action', {
      ...wallet,
      ...key,
      ...files,
      ...dir,
      ...mode,
    });

    const result = await signTransactionWithAliasFile(
      wallet.keyWalletConfig,
      key.keyAliasSelect,
      password.securityPassword,
      files.txUnsignedTransactionFiles.map((file) =>
        join(dir.txTransactionDir, file),
      ),
      false,
      mode.legacy,
    );

    assertCommandError(result);

    console.log(
      chalk.green(`Signed transaction saved to ${result.data.path}.`),
    );
    console.log(chalk.green(`\nTransaction signed successfully.\n`));
  },
);
