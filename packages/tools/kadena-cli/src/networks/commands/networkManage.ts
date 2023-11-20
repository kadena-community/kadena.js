import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import {
  externalNetworkExplorerUrlPrompt,
  externalNetworkHostPrompt,
  externalNetworkIdPrompt,
  externalNetworkNamePrompt,
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
      network: await externalNetworkNamePrompt(config.networkConfig.network),
      networkId: await externalNetworkIdPrompt(config.networkConfig.networkId),
      networkHost: await externalNetworkHostPrompt(
        config.networkConfig.networkHost,
      ),
      networkExplorerUrl: await externalNetworkExplorerUrlPrompt(
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
