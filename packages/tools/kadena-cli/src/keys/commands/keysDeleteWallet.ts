import { select } from '@inquirer/prompts';
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
import { removeAfterFirstDot } from '../../utils/path.util.js';
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

const confirmDelete = createOption({
  key: 'confirmDelete',
  defaultIsOptional: false,
  async prompt(prev, args) {
    if (typeof args.keyWallet !== 'string') return false;

    // delete all prompt
    if (args.keyWallet === 'all') {
      return await select({
        message: 'Are you sure you want to delete ALL wallets',
        choices: [
          { value: true, name: 'Yes, delete all wallets' },
          { value: false, name: 'No, do not delete any wallet' },
        ],
      });
    }

    // specific wallet
    const walletName = removeAfterFirstDot(args.keyWallet);
    const walletData = await getWallet(walletName);

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
  [globalOptions.keyWalletSelect(), confirmDelete()],
  async (config) => {
    try {
      debug('delete-wallet:action')({ config });

      if (config.confirmDelete !== true) {
        console.log(chalk.yellow('\nNo wallets were deleted.\n'));
        return;
      }

      const wallet =
        typeof config.keyWallet === 'string'
          ? config.keyWallet
          : config.keyWallet.fileName;

      const result = await deleteWallet(wallet);
      assertCommandError(result);

      if (wallet === 'all') {
        console.log(chalk.green('\nAll wallets have been deleted.\n'));
      } else {
        console.log(
          chalk.green(
            `\nThe wallet: "${wallet}" and associated key files have been deleted.\n`,
          ),
        );
      }
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
