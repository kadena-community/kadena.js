import type { Command } from 'commander';

import { printWalletKeys } from '../../keys/utils/keysDisplay.js';
import { getAllWallets, getWallet } from '../../keys/utils/keysHelpers.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { walletOptions } from '../walletOptions.js';

export const createListWalletsCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List wallet(s)',
  [walletOptions.walletNameSelectWithAll()],
  async (option) => {
    const config = await option.walletName();
    log.debug('list-keys:action', config);

    if (config.walletName === 'all') {
      const walletNames = await getAllWallets();
      for (const wallet of walletNames) {
        await printWalletKeys(await getWallet(wallet));
      }
    } else if (config.walletNameConfig === null) {
      return log.error(`Selected wallet "${config.walletName}" not found.`);
    }

    await printWalletKeys(config.walletNameConfig);
  },
);
