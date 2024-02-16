import type { Command } from 'commander';
import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletContent } from '../../keys/utils/keysHelpers.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';

import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { parseTransactionsFromStdin } from '../utils/input.js';
import { saveSignedTransactions } from '../utils/storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionsWithSeed,
} from '../utils/txHelpers.js';

export const signTransactionWithLocalWallet = async ({
  password,
  signed,
  commands,
  wallet,
  walletConfig,
}: {
  wallet: string;
  walletConfig: IWallet;
  password: string;
  commands: IUnsignedCommand[];
  signed: boolean;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  if (commands.length === 0) {
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
      commands,
      walletConfig.legacy,
    );

    const savedTransactions = await saveSignedTransactions(signedCommands);

    const signingStatus = await assessTransactionSigningStatus(signedCommands);
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
      errors: [`Error in signTransactionWithLocalWallet: ${error.message}`],
    };
  }
};

export const signTransactionFilesWithLocalWallet = async (data: {
  wallet: string;
  walletConfig: IWallet;
  password: string;
  files: string[];
  signed: boolean;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  return signTransactionWithLocalWallet({
    ...data,
    commands: await getTransactionsFromFile(data.files, data.signed),
  });
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
    txOptions.directory({ disableQuestion: true }),
    txOptions.txUnsignedTransactionFiles(),
  ],
  async (option, values, stdin) => {
    const wallet = await option.keyWallet();

    if (wallet.keyWalletConfig === null) {
      throw new Error(`Wallet: ${wallet.keyWallet} does not exist.`);
    }

    const password = await option.securityPassword();

    const result = await (async () => {
      if (stdin !== undefined) {
        const command = await parseTransactionsFromStdin(stdin);

        log.debug('sign-with-local-wallet:action', {
          ...wallet,
          ...password,
          command,
        });

        return await signTransactionWithLocalWallet({
          wallet: wallet.keyWallet,
          walletConfig: wallet.keyWalletConfig!,
          password: password.securityPassword,
          commands: [command],
          signed: false,
        });
      } else {
        const directory = (await option.directory()).directory ?? process.cwd();
        const { txUnsignedTransactionFiles } =
          await option.txUnsignedTransactionFiles({
            signed: false,
            path: directory,
          });
        const files = txUnsignedTransactionFiles.map((file) =>
          path.resolve(path.join(directory, file)),
        );

        log.debug('sign-with-local-wallet:action', {
          ...wallet,
          ...password,
          files,
        });

        return await signTransactionFilesWithLocalWallet({
          wallet: wallet.keyWallet,
          walletConfig: wallet.keyWalletConfig!,
          password: password.securityPassword,
          files: files,
          signed: false,
        });
      }
    })();

    assertCommandError(result);

    if (result.data.commands.length === 1) {
      log.output(JSON.stringify(result.data.commands[0], null, 2));
    }
    result.data.commands.forEach((tx) => {
      log.info(`Signed transaction saved to ${tx.path}`);
    });
  },
);
