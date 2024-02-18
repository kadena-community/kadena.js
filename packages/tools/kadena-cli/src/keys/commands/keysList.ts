import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { printWalletKeys } from '../utils/keysDisplay.js';
import { getAllWallets, getWallet } from '../utils/keysHelpers.js';

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List key(s)',
  [globalOptions.keyWalletSelectWithAll()],
  async (config) => {
    debug('list-keys:action')({ config });

    if (config.keyWallet === 'all') {
      const walletNames = await getAllWallets();
      for (const wallet of walletNames) {
        await printWalletKeys(await getWallet(wallet));
      }
    } else if (config.keyWalletConfig === null) {
      return console.error(
        chalk.red(`Selected wallet "${config.keyWallet}" not found.`),
      );
    }

    await printWalletKeys(config.keyWalletConfig);
  },
);
