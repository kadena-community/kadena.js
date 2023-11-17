import debug from 'debug';
import { networkDeletePrompt } from '../../prompts/network.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { removeNetwork } from '../utils/networkHelpers.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';

export const deleteNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'Delete network',
  [globalOptions.networkNetwork()],
  async (config) => {
    debug('network-delete:action')({ config });

    const overwrite = await networkDeletePrompt(config.network);
    if (overwrite === 'no') {
      console.log(
        chalk.yellow(
          `\nThe network configuration "${config.network}" will not be deleted.\n`,
        ),
      );
      return;
    }

    removeNetwork(config);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been deleted.\n`,
      ),
    );
  },
);
