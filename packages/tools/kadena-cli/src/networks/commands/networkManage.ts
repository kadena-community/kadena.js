import type { Command } from 'commander';

import { services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';
import {
  mergeNetworkConfig,
  removeNetwork,
  writeNetworks,
} from '../utils/networkHelpers.js';

/**
 * Creates a command to generate wallets.
 * @param {Command} program - The commander program.
 * @param {string} version - The version of the program.
 */
export const manageNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'update',
  'Update networks',
  [
    globalOptions.network({ isOptional: false }),
    networkOptions.networkExplorerUrl(),
    networkOptions.networkHost(),
    networkOptions.networkId(),
    networkOptions.networkName(),
  ],
  async (option) => {
    const kadenaDir = services.config.getDirectory();
    if (kadenaDir === null) {
      throw new KadenaError('no_kadena_directory');
    }

    const networkData = await option.network();
    const networkName = await option.networkName();
    const networkId = await option.networkId({
      defaultValue: networkData.networkConfig.networkId,
    });
    const networkHost = await option.networkHost({
      defaultValue: networkData.networkConfig.networkHost,
    });
    const networkExplorerUrl = await option.networkExplorerUrl({
      defaultValue: networkData.networkConfig.networkExplorerUrl,
    });

    log.debug('update-network:action', {
      networkExplorerUrl,
      networkHost,
      networkId,
      networkName,
    });

    const hasNetworkNameChanged =
      networkData.network !== networkName.networkName;

    const updatedNetworkConfig = await mergeNetworkConfig(
      kadenaDir,
      networkData.network,
      {
        network: networkName.networkName,
        networkId: networkId.networkId,
        networkHost: networkHost.networkHost,
        networkExplorerUrl: networkExplorerUrl.networkExplorerUrl,
      },
    );

    await writeNetworks(kadenaDir, updatedNetworkConfig);

    if (hasNetworkNameChanged) {
      await removeNetwork(networkData.networkConfig);
    }

    log.info(
      log.color.green(
        `\nThe network configuration "${networkData.network}" has been updated.\n`,
      ),
    );
  },
);
