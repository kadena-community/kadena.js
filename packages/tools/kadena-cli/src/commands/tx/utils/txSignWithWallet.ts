import path from 'node:path';

import type { ICommand, IUnsignedCommand } from '@kadena/types';
import type { CommandResult } from '../../../utils/command.util.js';
import { assertCommandError } from '../../../utils/command.util.js';

import type {
  IWallet,
  IWalletKey,
} from '../../../services/wallet/wallet.types.js';
import type { CommandOption } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import type { options } from '../commands/txSignOptions.js';
import { parseTransactionsFromStdin } from './input.js';
import { saveSignedTransactions } from './storage.js';
import {
  assessTransactionSigningStatus,
  displaySignersFromUnsignedCommands,
  extractRelevantWalletAndKeyPairsFromCommand,
  filterRelevantUnsignedCommandsForWallet,
  getTransactionsFromFile,
  getWalletsAndKeysForSigning,
  processSigningStatus,
  signTransactionWithWallet,
} from './txHelpers.js';

export const signTransactionsWithWallet = async ({
  password,
  unsignedCommands,
  skippedCommands,
  relevantKeyPairs,
  wallet,
  chainweaverSignatures,
}: {
  password: string;
  unsignedCommands: IUnsignedCommand[];
  skippedCommands: IUnsignedCommand[];
  relevantKeyPairs: IWalletKey[];
  wallet: IWallet;
  chainweaverSignatures?: boolean;
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

    const savedTransactions = await saveSignedTransactions(transactions, {
      chainweaverSignatures,
    });

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
    const { legacy: chainweaverSignatures } = await option.legacy();

    if (stdin !== undefined) {
      const command = await parseTransactionsFromStdin(stdin);
      const { walletName, walletNameConfig: walletConfig } =
        await option.walletName();

      if (walletConfig === null) {
        throw new Error(`Wallet: ${walletName} does not exist.`);
      }

      const walletAndKeys = await extractRelevantWalletAndKeyPairsFromCommand(
        command,
        walletConfig,
      );

      const password = await option.passwordFile({ wallet: walletConfig });
      log.debug('sign-with-wallet:action', {
        walletConfig,
        password,
        command,
      });
      return await signTransactionsWithWallet({
        password: password.passwordFile,
        unsignedCommands: [command],
        skippedCommands: [],
        relevantKeyPairs: walletAndKeys.relevantKeyPairs,
        wallet: walletConfig,
        chainweaverSignatures,
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

      log.debug('sign-with-wallet:action', {
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

      const { walletName, walletNameConfig: walletConfig } =
        await option.walletName({ wallets });
      if (walletConfig === null) {
        throw new Error(`Wallet: ${walletName} does not exist.`);
      }

      const password = await option.passwordFile({ wallet: walletConfig });

      const { unsignedCommands, skippedCommands, relevantKeyPairs } =
        await filterRelevantUnsignedCommandsForWallet(
          unsignedCommandsUnfiltered,
          walletAndKeys.find(
            (walletItem) => walletItem.wallet.alias === walletConfig.alias,
          ),
        );

      displaySignersFromUnsignedCommands(unsignedCommands);

      return await signTransactionsWithWallet({
        password: password.passwordFile,
        unsignedCommands,
        skippedCommands,
        relevantKeyPairs,
        wallet: walletConfig,
        chainweaverSignatures,
      });
    }
  })();

  assertCommandError(results);

  log.output(
    null,
    results.data.commands.map((tx) => ({
      filePath: tx.path,
      command: tx.command,
    })),
  );

  results.data.commands?.forEach((tx, i) => {
    const cmd = JSON.parse(results.data.commands[i]?.command?.cmd ?? '{}');
    const code = JSON.stringify(cmd?.payload?.exec?.code, null, 2);

    log.info(log.color.green(`Transaction executed code: `));
    log.info(code);

    const hash = results.data.commands[i]?.command?.hash;
    if (hash) {
      log.info(
        log.color.green(
          `\nTransaction with hash: ${hash} was successfully signed.`,
        ),
      );
    }

    if (tx.path) {
      log.info(`Signed transaction saved to ${tx.path}`);
    }
  });
}
