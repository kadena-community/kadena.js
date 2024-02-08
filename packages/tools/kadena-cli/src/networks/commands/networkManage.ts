import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { removeNetwork, writeNetworks } from '../utils/networkHelpers.js';

/**
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const manageNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommandFlexible(
  'update',
  'Manage networks',
  [
    globalOptions.network(),
    globalOptions.networkExplorerUrl(),
    globalOptions.networkHost(),
    globalOptions.networkId(),
    globalOptions.networkName(),
  ],
  async (option) => {
    const networkData = await option.network();
    const networkName = await option.networkName();
    const networkId = await option.networkId();
    const networkHost = await option.networkHost();
    const networkExplorerUrl = await option.networkExplorerUrl();

    debug.log('manage-networks', {
      networkExplorerUrl,
      networkHost,
      networkId,
      networkName,
    });

    await writeNetworks({
      network: networkName.networkName,
      networkId: networkId.networkId,
      networkHost: networkHost.networkHost,
      networkExplorerUrl: networkExplorerUrl.networkExplorerUrl,
    });

    if (networkData.network !== networkName.networkName) {
      await removeNetwork(networkData.networkConfig);
    }

    console.log(
      chalk.green(
        `\nThe network configuration "${networkData.network}" has been updated.\n`,
      ),
    );
  },
);
