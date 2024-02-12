import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import { z } from 'zod';

import { WALLET_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { select } from '../../utils/prompts.js';
import type { IWallet } from '../utils/keysHelpers.js';
import { getWallet } from '../utils/keysHelpers.js';

export const deleteWallet = async (
  wallet: string,
  walletConfig: IWallet,
): Promise<CommandResult<{}>> => {
  const walletFolderPath = `${WALLET_DIR}/${walletConfig?.folder}`;
  await services.filesystem.deleteDirectory(walletFolderPath);

  return { success: true, data: {} };
};

export const deleteAllWallets = async (): Promise<CommandResult<{}>> => {
  await services.filesystem.deleteDirectory(WALLET_DIR);
  return { success: true, data: {} };
};

const confirmDelete = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  async prompt(args) {
    if (typeof args.keyWallet !== 'string') return false;

    if (args.keyWallet === 'all') {
      return await select({
        message: 'Are you sure you want to delete ALL wallets',
        choices: [
          { value: true, name: 'Yes, delete all wallets' },
          { value: false, name: 'No, do not delete any wallet' },
        ],
      });
    }

    const walletData = await getWallet(args.keyWallet);

    if (!walletData) return false;

    const keysText =
      walletData.keys.length > 0
        ? ` with keys: ${walletData.keys.map((key) => `"${key}"`).join(', ')}`
        : '';

    return await select({
      message: `Are you sure you want to delete the wallet: "${args.keyWallet}"${keysText}?`,
      choices: [
        { value: true, name: 'Yes' },
        { value: false, name: 'No' },
      ],
    });
  },
  validation: z.boolean(),
  option: new Option('--confirm', 'Confirm wallet deletion'),
});

export const createDeleteKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete-wallet',
  'delete wallet from your local storage',
  [globalOptions.keyWalletSelectWithAll(), confirmDelete()],
  async (config) => {
    if (config.confirm !== true) {
      console.log(chalk.yellow('\nNo wallets were deleted.\n'));
      return;
    }

    try {
      debug('delete-wallet:action')({ config });
      if (config.keyWallet === 'all') {
        const result = await deleteAllWallets();
        assertCommandError(result);
        console.log(chalk.green('\nAll wallets have been deleted.\n'));
      } else {
        if (config.keyWalletConfig === null) {
          throw new Error(`Wallet: ${config.keyWallet} does not exist.`);
        }

        const result = await deleteWallet(
          config.keyWallet,
          config.keyWalletConfig,
        );
        assertCommandError(result);
        console.log(
          chalk.green(
            `\nThe wallet: "${config.keyWallet}" and associated key files have been deleted.\n`,
          ),
        );
      }
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
