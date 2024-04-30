import type { Command } from 'commander';
import path from 'path';

import { services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { networkOptions } from '../networkOptions.js';
import { writeNetworks } from '../utils/networkHelpers.js';
import { getNetworkDirectory } from '../utils/networkPath.js';

export const createNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add',
  'Add network configuration',
  [
    networkOptions.networkName({ isOptional: false }),
    networkOptions.networkId({ isOptional: false }),
    networkOptions.networkHost({ isOptional: false }),
    networkOptions.networkExplorerUrl(),
    networkOptions.networkOverwrite(),
  ],
  async (option, { collect }) => {
    const kadenaDir = services.config.getDirectory();
    const networkDir = getNetworkDirectory();
    if (networkDir === null || kadenaDir === null) {
      throw new KadenaError('no_kadena_directory');
    }

    const config = await collect(option);
    log.debug('network-create:action', config);

    const filePath = path.join(networkDir, `${config.networkName}.yaml`);

    if (
      !(await services.filesystem.fileExists(filePath)) &&
      config.networkOverwrite === 'no'
    ) {
      log.warning(
        `\nThe existing network configuration "${config.networkName}" will not be updated.\n`,
      );
      return;
    }

    const networkConfig = {
      network: config.networkName,
      networkId: config.networkId,
      networkHost: config.networkHost,
      networkExplorerUrl: config.networkExplorerUrl,
    };

    await writeNetworks(kadenaDir, networkConfig);

    log.info(
      log.color.green(
        `\nThe network configuration "${config.networkName}" has been saved.\n`,
      ),
    );
  },
);
