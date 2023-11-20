import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import {
  networkExplorerUrlPrompt,
  networkHostPrompt,
  networkIdPrompt,
  networkNamePrompt,
} from '../../prompts/network.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { writeNetworks } from '../utils/networkHelpers.js';

export const manageNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'update',
  'Manage networks',
  [globalOptions.network()],
  async (config) => {
    debug('network-manage:action')({ config });

    writeNetworks({
      network: await networkNamePrompt(config.networkConfig.network),
      networkId: await networkIdPrompt(config.networkConfig.networkId),
      networkHost: await networkHostPrompt(config.networkConfig.networkHost),
      networkExplorerUrl: await networkExplorerUrlPrompt(
        config.networkConfig.networkExplorerUrl,
      ),
    });

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been updated.\n`,
      ),
    );
  },
);
