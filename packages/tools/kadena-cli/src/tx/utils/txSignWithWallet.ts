import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';

import type { EncryptedString } from '@kadena/hd-wallet';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWallet, getWalletContent } from '../../keys/utils/keysHelpers.js';

import type { IKeyPair } from '../../keys/utils/storage.js';
import type { CommandOption } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import type { IWalletWithKey } from './txHelpers.js';
import {
  assessTransactionSigningStatus,
  extractRelevantWalletAndKeyPairsFromCommand,
  filterRelevantUnsignedCommandsForWallet,
  getTransactionsFromFile,
  getWalletsAndKeysForSigning,
  processSigningStatus,
  signTransactionWithSeed,
} from './txHelpers.js';

export const signTransactionsWithwallet = async ({
  password,
  signed,
  unsignedCommands,
  skippedCommands,
  relevantKeyPairs,
  wallet,
  walletConfig,
}: {
  password: string;
  signed: boolean;
  unsignedCommands: IUnsignedCommand[];
  skippedCommands: IUnsignedCommand[];
  relevantKeyPairs: IKeyPair[];
  wallet: string;
  walletConfig: IWallet;
}): Promise<
  CommandResult<{ commands: { command: ICommand; path: string }[] }>
> => {
  if (unsignedCommands.length === 0) {
    return {
      status: 'error',
      errors: ['No unsigned transactions found.'],
    };
  }
  const transactions: (IUnsignedCommand | ICommand)[] = [];

  const seed = (await getWalletContent(wallet)) as EncryptedString;

  try {
    for (const command of unsignedCommands) {
      const signedCommand = await signTransactionWithSeed(
        seed,
        password,
        command,
        walletConfig.legacy,
        relevantKeyPairs,
      );

      // Quietly continue if no commands were signed
      if (signedCommand === undefined) {
        continue;
      }

      transactions.push(signedCommand);
    }

    const savedTransactions = await saveSignedTransactions(transactions);

    const signingStatus = await assessTransactionSigningStatus([
      ...skippedCommands,
      ...transactions,
    ]);

    return processSigningStatus(savedTransactions, signingStatus);
  } catch (error) {
    return {
      status: 'error',
      errors: [`Error in signTransactionWithwallet: ${error.message}`],
    };
  }
};

export async function signWithwallet(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  const results = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      const wallet = await option.walletName();
      const walletConfig = await getWallet(wallet.walletName);

      if (walletConfig === null) {
        throw new Error(`Wallet: ${wallet.walletName} does not exist.`);
      }

      const walletAndKeys = await extractRelevantWalletAndKeyPairsFromCommand(
        command,
        wallet.walletName,
        walletConfig,
      );

      const password = await option.passwordFile();
      log.debug('sign-with-local-wallet:action', {
        wallet,
        password,
        command,
      });
      return await signTransactionsWithwallet({
        password: password.passwordFile,
        signed: false,
        unsignedCommands: [command],
        skippedCommands: [],
        relevantKeyPairs: walletAndKeys.relevantKeyPairs,
        wallet: wallet.walletName,
        walletConfig: walletConfig!,
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
        files,
      });

      const unsignedCommandsUnfiltered = await getTransactionsFromFile(
        files,
        false,
      );
      const walletAndKeys = await getWalletsAndKeysForSigning(
        unsignedCommandsUnfiltered,
      );

      const wallets = [
        ...new Set(walletAndKeys.map((walletItem) => walletItem.wallet)),
      ];

      const wallet = await option.walletName({ wallets });
      const walletConfig = await getWallet(wallet.walletName);
      const password = await option.passwordFile();

      if (walletConfig === null) {
        throw new Error(`Wallet: ${wallet.walletName} does not exist.`);
      }

      const { unsignedCommands, skippedCommands, relevantKeyPairs } =
        await filterRelevantUnsignedCommandsForWallet(
          unsignedCommandsUnfiltered,
          walletAndKeys,
          wallet.walletName,
        );

      return await signTransactionsWithwallet({
        password: password.passwordFile,
        signed: false,
        unsignedCommands,
        skippedCommands,
        relevantKeyPairs,
        wallet: wallet.walletName,
        walletConfig,
      });
    }
  })();

  assertCommandError(results);

  if (results.data.commands.length !== 0) {
    results.data.commands.forEach((tx, i) => {
      log.info(
        `Transaction with hash: ${results.data.commands[i].command.hash} was successfully signed.`,
      );
      log.output(JSON.stringify(results.data.commands[i].command, null, 2));
      log.info(`Signed transaction saved to ${tx.path}`);
    });
  }
}
