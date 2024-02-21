import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';

export const createConfigInitCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'init',
  'Initialize default configuration of the Kadena CLI',
  [],
  async (config) => {
    log.debug('init:action', config);

    await import('../../networks/init.js');
    log.info(log.color.green('Configured default networks.'));

    await import('../../devnet/init.js');
    log.info(log.color.green('Configured default devnets.'));

    log.info(log.color.green('Configuration complete!'));
  },
);
