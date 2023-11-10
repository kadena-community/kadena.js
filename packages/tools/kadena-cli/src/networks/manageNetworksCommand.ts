import debug from 'debug';
import { networkOverwritePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';
import { writeNetworks } from './networksHelpers.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';

export const manageNetworksCommand = createCommand(
  'manage',
  'Manage networks',
  [globalOptions.networkSelect(), globalOptions.networkId(), globalOptions.networkHost(), globalOptions.networkExplorerUrl()],
  async (config) => {
    debug('network-manage:action')({config});

    const overwrite = await networkOverwritePrompt(config.network);
    if (overwrite === 'no') {
      console.log(chalk.yellow(`\nThe network configuration "${config.network}" will not be updated.\n`));
      return;
    }

    writeNetworks(config);

    console.log(chalk.green(`\nThe network configuration "${config.network}" has been updated.\n`));
  },
);
