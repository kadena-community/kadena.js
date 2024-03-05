import type { Command } from 'commander';
import { devnetDefaults } from '../../constants/devnets.js';
import { writeDevnet } from '../../devnet/utils/devnetHelpers.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';

export const createConfigInitCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'init',
  'Initialize default configuration of the Kadena CLI',
  [],
  async () => {
    log.debug('config init');

    await ensureNetworksConfiguration();
    log.info(log.color.green('Configured default networks.'));

    await writeDevnet(devnetDefaults.devnet);
    log.info(log.color.green('Configured default devnets.'));

    log.info(log.color.green('Configuration complete!'));
  },
);
