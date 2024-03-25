import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';

import type { CommandOption } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';

import { services } from '../../services/index.js';
import type {
  IWallet,
  IWalletKey,
} from '../../services/wallet/wallet.types.js';
import {
  assessTransactionSigningStatus,
  extractRelevantWalletAndKeyPairsFromCommand,
  filterRelevantUnsignedCommandsForWallet,
  getTransactionsFromFile,
  getWalletsAndKeysForSigning,
  processSigningStatus,
  signTransactionWithWallet,
} from './txHelpers.js';

export const signTransactionsWithWallet = async ({
  password,
  signed,
  unsignedCommands,
  skippedCommands,
  relevantKeyPairs,
  wallet,
}: {
  password: string;
  signed: boolean;
  unsignedCommands: IUnsignedCommand[];
  skippedCommands: IUnsignedCommand[];
  relevantKeyPairs: IWalletKey[];
  wallet: IWallet;
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

  try {
    for (const command of unsignedCommands) {
      const signedCommand = await signTransactionWithWallet(
        wallet,
        password,
        command,
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

export async function signWithWallet(
  option: CommandOption<typeof options>,
  values: string[],
  stdin?: string,
): Promise<void> {
  const results = await (async () => {
    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      const wallet = await option.walletName();
      const walletConfig = await services.wallet.get(wallet.walletName);

      if (walletConfig === null) {
        throw new Error(`Wallet: ${wallet.walletName} does not exist.`);
      }

      const walletAndKeys = await extractRelevantWalletAndKeyPairsFromCommand(
        command,
        walletConfig,
      );

      const password = await option.passwordFile();
      log.debug('sign-with-local-wallet:action', {
        wallet,
        password,
        command,
      });
      return await signTransactionsWithWallet({
        password: password.passwordFile,
        signed: false,
        unsignedCommands: [command],
        skippedCommands: [],
        relevantKeyPairs: walletAndKeys.relevantKeyPairs,
        wallet: walletConfig,
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
      const walletConfig = wallet.walletNameConfig;
      const password = await option.passwordFile();

      if (walletConfig === null) {
        throw new Error(`Wallet: ${wallet.walletName} does not exist.`);
      }

      const { unsignedCommands, skippedCommands, relevantKeyPairs } =
        await filterRelevantUnsignedCommandsForWallet(
          unsignedCommandsUnfiltered,
          {
            wallet: wallets.find(
              (x) => x.alias === wallet.walletNameConfig!.alias,
            )!,
            relevantKeyPairs: [],
          },
        );

      return await signTransactionsWithWallet({
        password: password.passwordFile,
        signed: false,
        unsignedCommands,
        skippedCommands,
        relevantKeyPairs,
        wallet: walletConfig,
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
