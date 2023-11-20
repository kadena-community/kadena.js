import { defaultNetworksPath } from '../../constants/networks.js';
import { createCommand } from '../../utils/createCommand.js';
import { ensureFileExists } from '../../utils/filesystem.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { clearCLI } from '../../utils/helpers.js';

import { externalNetworkOverwritePrompt } from '../../prompts/network.js';
import type { INetworkCreateOptions } from '../utils/networkHelpers.js';
import { writeNetworks } from '../utils/networkHelpers.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import path from 'path';

export const createNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create',
  'Create network',
  [
    globalOptions.networkName(false),
    globalOptions.networkId(),
    globalOptions.networkHost(),
    globalOptions.networkExplorerUrl(),
  ],
  async (config) => {
    debug('network-create:action')({ config });

    const filePath = path.join(defaultNetworksPath, `${config.network}.yaml`);

    if (ensureFileExists(filePath)) {
      const overwrite = await externalNetworkOverwritePrompt(config.network);
      if (overwrite === 'no') {
        console.log(
          chalk.yellow(
            `\nThe existing network configuration "${config.network}" will not be updated.\n`,
          ),
        );
        return;
      }
    }

    writeNetworks(config as unknown as INetworkCreateOptions);
    clearCLI(true);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been saved.\n`,
      ),
    );
  },
);
