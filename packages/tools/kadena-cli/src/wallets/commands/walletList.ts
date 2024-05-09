import type { Command } from 'commander';

import { printWalletKeys } from '../../keys/utils/keysDisplay.js';
import type { IWallet } from '../../services/wallet/wallet.types.js';
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

    if (config.walletNameConfig === null) {
      return log.error(`Selected wallet not found.`);
    } else if (Array.isArray(config.walletNameConfig)) {
      if (config.walletNameConfig.length === 0) {
        log.info('There are no wallets created. You can add one with:\n');
        log.info('  kadena wallet add');
      }
      for (const wallet of config.walletNameConfig) {
        await printWalletKeys(wallet);
      }
      log.output(
        null,
        config.walletNameConfig.reduce(
          (acc, wallet) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { seed, ...rest } = wallet;
            acc[wallet.alias] = rest;
            return acc;
          },
          {} as Record<string, Omit<IWallet, 'seed'>>,
        ),
      );
    } else {
      await printWalletKeys(config.walletNameConfig);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { seed, ...rest } = config.walletNameConfig;
      log.output(null, rest);
    }
  },
);
