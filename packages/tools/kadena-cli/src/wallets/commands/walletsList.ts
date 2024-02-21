import type { Command } from 'commander';

import { printWalletKeys } from '../../keys/utils/keysDisplay.js';
import { getAllWallets, getWallet } from '../../keys/utils/keysHelpers.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';

export const createListWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List wallet(s)',
  [globalOptions.walletWalletSelectWithAll()],
  async (config) => {
    log.debug('list-keys:action', { config });

    if (config.walletWallet === 'all') {
      const walletNames = await getAllWallets();
      for (const wallet of walletNames) {
        await printWalletKeys(await getWallet(wallet));
      }
    } else if (config.walletWalletConfig === null) {
      return log.error(`Selected wallet "${config.walletWallet}" not found.`);
    }

    await printWalletKeys(config.walletWalletConfig);
  },
);
