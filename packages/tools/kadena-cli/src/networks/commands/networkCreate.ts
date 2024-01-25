import { defaultNetworksPath } from '../../constants/networks.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

import type { INetworkCreateOptions } from '../utils/networkHelpers.js';
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
    globalOptions.networkId(),
    globalOptions.networkHost(),
    globalOptions.networkExplorerUrl(),
    globalOptions.networkOverwrite(),
  ],
  async (config) => {
    debug('network-create:action')({ config });

    const filePath = path.join(defaultNetworksPath, `${config.network}.yaml`);

    if (
      !(await services.filesystem.fileExists(filePath)) &&
      config.networkOverwrite === 'no'
    ) {
      console.log(
        chalk.yellow(
          `\nThe existing network configuration "${config.network}" will not be updated.\n`,
        ),
      );
      return;
    }

    await writeNetworks(config as unknown as INetworkCreateOptions);

    console.log(
      chalk.green(
        `\nThe network configuration "${config.network}" has been saved.\n`,
      ),
    );
  },
);
