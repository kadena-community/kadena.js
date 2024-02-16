import { defaultNetworksPath } from '../../constants/networks.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import { writeNetworks } from '../utils/networkHelpers.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import path from 'path';

export const createNetworksCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create',
  'Create network',
  [
    globalOptions.networkName({ isOptional: false }),
    globalOptions.networkId({ isOptional: false }),
    globalOptions.networkHost({ isOptional: false }),
    globalOptions.networkExplorerUrl(),
    globalOptions.networkOverwrite(),
  ],
  async (config) => {
    debug('network-create:action')({ config });

    const filePath = path.join(
      defaultNetworksPath,
      `${config.networkName}.yaml`,
    );

    if (
      !(await services.filesystem.fileExists(filePath)) &&
      config.networkOverwrite === 'no'
    ) {
      console.log(
        chalk.yellow(
          `\nThe existing network configuration "${config.networkName}" will not be updated.\n`,
        ),
      );
      return;
    }

    const networkConfig = {
      network: config.networkName,
      networkId: config.networkId,
      networkHost: config.networkHost,
      networkExplorerUrl: config.networkExplorerUrl,
    };

    await writeNetworks(networkConfig);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.networkName}" has been saved.\n`,
      ),
    );
  },
);
