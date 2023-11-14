import debug from 'debug';
import { networkDeletePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';
import { removeNetwork } from './networksHelpers.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';

export const deleteNetworksCommand = createCommand(
  'delete',
  'Delete network',
  [globalOptions.networkSelect()],
  async (config) => {
    debug('network-delete:action')({config});

    const overwrite = await networkDeletePrompt(config.network);
    if (overwrite === 'no') {
      console.log(chalk.yellow(`\nThe network configuration "${config.network}" will not be deleted.\n`));
      return;
    }

    removeNetwork(config);

    console.log(chalk.green(`\nThe network configuration "${config.network}" has been deleted.\n`));
  },
);
