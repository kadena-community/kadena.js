import debug from 'debug';
import { existsSync } from 'fs';
import { rimraf } from 'rimraf'; // Ensure that rimraf is properly imported
import { WALLET_DIR } from '../../constants/config.js';
import { createExternalPrompt } from '../../prompts/generic.js';
import {
  confirmWalletDeletePrompt,
  walletDeletePrompt,
} from '../../prompts/keys.js';
import { removeAfterFirstDot } from '../../utils/filesystem.js';
import { globalOptions } from '../../utils/globalOptions.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';

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
        const confirmDelete = await externalPrompt.confirmWalletDeletePrompt();
        if (confirmDelete === 'no') {
          console.log(chalk.yellow('\nNo wallets were deleted.\n'));
          return;
        }

        rimraf.sync(WALLET_DIR);
        console.log(chalk.green('\nAll wallets have been deleted.\n'));
        return;
      }

      if (
        config.keyWallet === undefined ||
        config.keyWallet.fileName === undefined ||
        config.keyWallet.fileName === ''
      ) {
        console.error(chalk.red('Wallet file name is invalid.'));
        return;
      }

      const walletName = removeAfterFirstDot(config.keyWallet.fileName);
      const walletFileName = config.keyWallet.fileName;
      const walletFolderPath = `${WALLET_DIR}/${walletName}`;
      const walletPath = `${WALLET_DIR}/${walletName}/${walletFileName}`;

      if (!existsSync(walletPath)) {
        console.error(chalk.red(`Wallet: ${walletFileName} does not exist.`));
        return;
      }

      const shouldDelete = await externalPrompt.walletDeletePrompt(walletName);
      if (shouldDelete === 'no') {
        console.log(
          chalk.yellow(`\nThe wallet: "${walletName}" will not be deleted.\n`),
        );
        return;
      }

      rimraf.sync(walletFolderPath);

      console.log(
        chalk.green(
          `\nThe wallet: "${walletName}" and associated key files have been deleted.\n`,
        ),
      );
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
