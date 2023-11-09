import { defaultNetworksPath } from '../constants/networks.js';
import { ensureFileExists } from '../utils/filesystem.js';

import type { TNetworksCreateOptions } from './networksCreateQuestions.js';
import { writeNetworks } from './networksHelpers.js';

import debug from 'debug';
import path from 'path';

import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import chalk from 'chalk';
import { networkOverwritePrompt } from '../constants/prompts.js';

export const createNetworksCommand = createCommand(
  'create',
  'Create network',
  [globalOptions.network(), globalOptions.networkId(), globalOptions.networkHost(), globalOptions.networkExplorerUrl()],
  async (config) => {
    debug('network-create:action')({config});

    const filePath = path.join(defaultNetworksPath, `${config.network}.yaml`);

    if (ensureFileExists(filePath)) {
      const overwrite = await networkOverwritePrompt();
      if (overwrite === 'no') {
        console.log(chalk.yellow(`\nThe existing network configuration "${config.network}" will not be updated.\n`));
        return;
      }
    }

    writeNetworks(config as TNetworksCreateOptions);

    console.log(chalk.green(`\nThe network configuration "${config.network}" has been saved.\n`));
  },
);
