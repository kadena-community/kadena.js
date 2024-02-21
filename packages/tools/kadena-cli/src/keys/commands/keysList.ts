import type { Command } from 'commander';

import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
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
    log.debug('list-keys:action', { config });

    if (config.keyWallet === 'all') {
      const walletNames = await getAllWallets();
      for (const wallet of walletNames) {
        await printWalletKeys(await getWallet(wallet));
      }
    } else if (config.keyWalletConfig === null) {
      return log.error(`Selected wallet "${config.keyWallet}" not found.`);
    }

    await printWalletKeys(config.keyWalletConfig);
  },
);
