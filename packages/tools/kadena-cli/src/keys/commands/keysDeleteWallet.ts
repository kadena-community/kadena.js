import debug from 'debug';
import { WALLET_DIR } from '../../constants/config.js';
import { createExternalPrompt } from '../../prompts/generic.js';
import {
  confirmWalletDeletePrompt,
  walletDeletePrompt,
} from '../../prompts/keys.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { removeAfterFirstDot } from '../../utils/path.util.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { getWallet } from '../utils/keysHelpers.js';

/*

kadena keys create-wallet --key-wallet "test01" --security-password 12345678 --security-verify-password 12345678
kadena keys gen-hd --key-wallet "test01.wallet" --key-gen-from-choice "genPublicSecretKey" --key-alias "test" --security-password 12345678 --key-index-or-range "1"
kadena keys gen-hd --key-wallet "test01.wallet" --key-gen-from-choice "genPublicSecretKey" --key-alias "test2" --security-password 12345678 --key-index-or-range "1"

kadena keys delete-wallet --key-wallet "test01.wallet"
*/

export const deleteWallet = async (
  wallet: string,
): Promise<CommandResult<{}>> => {
  // Delete all wallets
  if (wallet === 'all') {
    await services.filesystem.deleteDirectory(WALLET_DIR);
    return { success: true, data: {} };
  }

  // Delete specific wallet
  const walletName = removeAfterFirstDot(wallet);
  const walletData = await getWallet(walletName);

  if (!walletData) {
    return { success: false, errors: [`Wallet: ${wallet} does not exist.`] };
  }

  const walletFolderPath = `${WALLET_DIR}/${walletData?.folder}`;
  await services.filesystem.deleteDirectory(walletFolderPath);

  return { success: true, data: {} };
};

export const createDeleteKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete-wallet',
  'delete wallet from your local storage',
  [globalOptions.keyWalletSelect()],
  async (config) => {
    try {
      debug('delete-wallet:action')({ config });

      const externalPrompt = createExternalPrompt({
        walletDeletePrompt,
        confirmWalletDeletePrompt,
      });

      if (config.keyWallet === 'all') {
        if (config.quiet !== true) {
          const confirmDelete =
            await externalPrompt.confirmWalletDeletePrompt();
          if (confirmDelete === 'no') {
            console.log(chalk.yellow('\nNo wallets were deleted.\n'));
            return;
          }
        }

        const result = await deleteWallet('all');
        assertCommandError(result);
        console.log(chalk.green('\nAll wallets have been deleted.\n'));
        return;
      }

      if (
        typeof config.keyWallet === 'string' ||
        config.keyWallet === undefined ||
        config.keyWallet.fileName === undefined ||
        config.keyWallet.fileName === ''
      ) {
        console.error(chalk.red('Wallet file name is invalid.'));
        return;
      }

      const walletName = removeAfterFirstDot(config.keyWallet.fileName);
      const walletData = await getWallet(walletName);

      if (!walletData) {
        console.log(
          chalk.yellow(`\nThe wallet: "${walletName}" could not be found.\n`),
        );
        return;
      }

      if (walletData.keys.length) {
        console.log(
          chalk.yellow(
            `The wallet ${walletName} contanins keys:\n${walletData.keys
              .map((key) => `- ${key}`)
              .join('\n')}`,
          ),
        );
      }

      if (config.quiet === true) {
        const shouldDelete =
          await externalPrompt.walletDeletePrompt(walletName);
        if (shouldDelete === 'no') {
          console.log(
            chalk.yellow(
              `\nThe wallet: "${walletName}" will not be deleted.\n`,
            ),
          );
          return;
        }
      }

      const result = await deleteWallet(config.keyWallet.fileName);
      assertCommandError(result);

      console.log(
        chalk.green(
          `\nThe wallet: "${'>tmp<'}" and associated key files have been deleted.\n`,
        ),
      );
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
