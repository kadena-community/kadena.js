import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import {
  networkExplorerUrlPrompt,
  networkHostPrompt,
  networkIdPrompt,
  networkNamePrompt,
} from '../../prompts/network.js';

import { createExternalPrompt } from '../../prompts/generic.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { removeNetwork, writeNetworks } from '../utils/networkHelpers.js';

export const manageNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'update',
  'Manage networks',
  [globalOptions.network()],
  async (config) => {
    debug('network-manage:action')({ config });

    const externalPrompts = createExternalPrompt({
      networkExplorerUrlPrompt,
      networkHostPrompt,
      networkIdPrompt,
      networkNamePrompt,
    });

    const network = await externalPrompts.networkNamePrompt(config.network);

    writeNetworks({
      network: network,
      networkId: await externalPrompts.networkIdPrompt(
        config.networkConfig.networkId,
      ),
      networkHost: await externalPrompts.networkHostPrompt(
        config.networkConfig.networkHost,
      ),
      networkExplorerUrl: await externalPrompts.networkExplorerUrlPrompt(
        config.networkConfig.networkExplorerUrl,
      ),
    });

    if (network !== config.network) {
      // name of network has changed, delete old network
      removeNetwork(config);
    }

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been updated.\n`,
      ),
    );
  },
);
