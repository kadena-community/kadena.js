import chalk from 'chalk';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { isDockerInstalled, updateDevnet } from '../utils/docker.js';

export const updateDevnetCommand = createCommand(
  'update',
  'Update the Docker image of a given devnet container image',
  [globalOptions.devnetVersion()],
  async (config) => {
    debug('devnet-update:action')({ config });

    // Abort if Docker is not installed
    if (!isDockerInstalled()) {
      console.log(
        chalk.red(
          'Updating devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }

    updateDevnet(config.version || 'latest');
  },
);
