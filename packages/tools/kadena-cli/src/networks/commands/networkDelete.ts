import debug from 'debug';
import { globalOptions } from '../../utils/globalOptions.js';
import { removeNetwork } from '../utils/networkHelpers.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';

export const deleteNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommandFlexible(
  'delete',
  'Delete network',
  [globalOptions.network(), globalOptions.networkDelete()],
  async (option) => {
    const networkData = await option.network();
    const deleteNetwork = await option.networkDelete({
      network: networkData.network,
    });

    debug.log('delete-network:action', {
      ...networkData,
      ...deleteNetwork,
    });

    if (deleteNetwork.networkDelete === 'no') {
      console.log(
        chalk.yellow(
          `\nThe network configuration "${networkData.network}" will not be deleted.\n`,
        ),
      );
      return;
    }

    await removeNetwork(networkData.networkConfig);

    console.log(
      chalk.green(
        `\nThe network configuration "${networkData.network}" has been deleted.\n`,
      ),
    );
  },
);
