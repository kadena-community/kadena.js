import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWalletContent } from '../../keys/utils/keysHelpers.js';

import type { CommandOption } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import {
  assessTransactionSigningStatus,
  getTransactionsFromFile,
  signTransactionsWithSeed,
} from './txHelpers.js';

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

    // Quietly return if no commands were signed, `signTransactionsWithSeed` already outputs an error.
    if (signedCommands.length === 0) {
      return { success: true, data: { commands: [] } };
    }

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

export async function signWithLocalWallet(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  const wallet = await option.walletName();

  if (wallet.walletNameConfig === null) {
    throw new Error(`Wallet: ${wallet.walletName} does not exist.`);
  }

  const password = await option.passwordFile();

  const result = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);

      log.debug('sign-with-local-wallet:action', {
        ...wallet,
        ...password,
        command,
      });

      return await signTransactionWithLocalWallet({
        wallet: wallet.walletName,
        walletConfig: wallet.walletNameConfig!,
        password: password.passwordFile,
        commands: [command],
        signed: false,
      });
    } else {
      const { directory } = await option.directory();
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
        wallet: wallet.walletName,
        walletConfig: wallet.walletNameConfig!,
        password: password.passwordFile,
        files: files,
        signed: false,
      });
    }
  })();

  assertCommandError(result);

  if (result.data.commands.length === 1) {
    log.output(JSON.stringify(result.data.commands[0].command, null, 2));
  }
  result.data.commands.forEach((tx) => {
    log.info(`Signed transaction saved to ${tx.path}`);
  });
}
