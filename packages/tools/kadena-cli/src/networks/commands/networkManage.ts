import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { networkOverwritePrompt } from '../../prompts/network.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { writeNetworks } from '../utils/networkHelpers.js';

export const manageNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'manage',
  'Manage networks',
  [
    globalOptions.networkNetwork(),
    globalOptions.networkId(),
    globalOptions.networkHost(),
    globalOptions.networkExplorerUrl(),
  ],
  async (config) => {
    debug('network-manage:action')({ config });

    const overwrite = await networkOverwritePrompt(config.network);
    if (overwrite === 'no') {
      console.log(
        chalk.yellow(
          `\nThe network configuration "${config.network}" will not be updated.\n`,
        ),
      );
      return;
    }

    writeNetworks(config);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been updated.\n`,
      ),
    );
  },
);
