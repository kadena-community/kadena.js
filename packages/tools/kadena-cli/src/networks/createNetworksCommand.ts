import { defaultNetworksPath } from '../constants/networks.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { writeNetworks } from './networksHelpers.js';

import debug from 'debug';
import path from 'path';

import chalk from 'chalk';
import type { Command } from 'commander';
import { networkOverwritePrompt } from '../constants/prompts.js';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';

export const createNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create',
  'Create network',
  [
    globalOptions.networkName(),
    globalOptions.networkId(),
    globalOptions.networkHost(),
    globalOptions.networkExplorerUrl(),
  ],
  async (config) => {
    debug('network-create:action')({ config });

    const filePath = path.join(defaultNetworksPath, `${config.network}.yaml`);

    if (ensureFileExists(filePath)) {
      const overwrite = await networkOverwritePrompt(config.network);
      if (overwrite === 'no') {
        console.log(
          chalk.yellow(
            `\nThe existing network configuration "${config.network}" will not be updated.\n`,
          ),
        );
        return;
      }
    }

    writeNetworks(config);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been saved.\n`,
      ),
    );
  },
);
