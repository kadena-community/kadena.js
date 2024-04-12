import type { Command } from 'commander';
import { getNetworkFiles } from '../../constants/networks.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { configOptions } from '../configOptions.js';

export const createConfigInitCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'init',
  'Initialize default configuration of the Kadena CLI',
  [configOptions.location()],
  async (option) => {
    const { location } = await option.location();
    log.debug('config init', { location });

    const exists = await services.filesystem.directoryExists(location);
    if (exists) {
      log.warning(`The configuration directory already exists at ${location}.`);
      return;
    }

    await services.filesystem.ensureDirectoryExists(location);

    await ensureNetworksConfiguration(location);

    log.info(log.color.green('Created configuration directory:\n'));
    log.info(`  ${location}\n`);
    log.info(log.color.green(`Added default networks:\n`));
    log.info(
      `${Object.keys(getNetworkFiles(location))
        .map((x) => `  - ${x}`)
        .join('\n')}`,
    );
  },
);
