import path from 'node:path';

import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaDecrypt } from '@kadena/hd-wallet';
import type { ICommand, IUnsignedCommand } from '@kadena/types';

import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletKey, toHexStr } from '../../keys/utils/keysHelpers.js';
import type { IKeyPair } from '../../keys/utils/storage.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import type { CommandOption } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionWithKeyPair,
} from './txHelpers.js';

export const signTransactionWithAliasFile = async ({
  alias,
  password,
  signed,
  commands: unsignedTransactions,
  wallet,
  legacy,
  directory,
}: {
  wallet: IWallet;
  alias: string;
  password: string;
  commands: IUnsignedCommand[];
  signed: boolean;
  legacy?: boolean;
  directory?: string;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
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

    const savedTransactions = await saveSignedTransactions(commands, directory);

    const signingStatus = await assessTransactionSigningStatus(commands);
    if (!signingStatus.success) return signingStatus;

    return {
      success: true,
      data: {
        commands: savedTransactions.map((tx) => ({
          command: tx.command as ICommand,
          path: tx.filePath,
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      errors: [`Error in signAction: ${error.message}`],
    };
  }
};

export const signTransactionFileWithAliasFile = async (data: {
  wallet: IWallet;
  alias: string;
  password: string;
  files: string[];
  signed: boolean;
  legacy?: boolean;
  directory?: string;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  return await signTransactionWithAliasFile({
    ...data,
    commands: await getTransactionsFromFile(data.files, data.signed),
  });
};

export async function signWithAliasFile(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  const wallet = await option.walletName();
  if (!wallet.walletNameConfig) throw new Error('wallet not found');

  const password = await option.passwordFile();
  const key = await option.keyAliasSelect({
    wallet: wallet.walletName,
  });
  const mode = await option.legacy();

  const result = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      log.debug('sign-with-key-alias-file:action', {
        ...wallet,
        ...key,
        ...mode,
        command,
      });
      return await signTransactionWithAliasFile({
        alias: key.keyAliasSelect,
        signed: false,
        wallet: wallet.walletNameConfig!,
        password: password.passwordFile,
        commands: [command],
        legacy: mode.legacy,
      });
    }
    const { directory } = await option.directory();
    const files = await option.txUnsignedTransactionFiles({
      signed: false,
      path: directory,
    });
    const absolutePaths = files.txUnsignedTransactionFiles.map((file) =>
      path.resolve(path.join(directory, file)),
    );
    log.debug('sign-with-key-alias-file:action', {
      ...wallet,
      ...key,
      ...files,
      directory,
      ...mode,
    });
    return await signTransactionFileWithAliasFile({
      alias: key.keyAliasSelect,
      signed: false,
      wallet: wallet.walletNameConfig!,
      password: password.passwordFile,
      files: absolutePaths,
      legacy: mode.legacy,
    });
  })();

  assertCommandError(result);

  if (result.data.commands.length === 1) {
    log.output(JSON.stringify(result.data.commands[0].command, null, 2));
  }
  result.data.commands.forEach((tx) => {
    log.info(`Signed transaction saved to ${tx.path}`);
  });
}
