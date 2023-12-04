import chalk from 'chalk';
import debug from 'debug';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { updateDevnet } from '../utils/docker.js';

export const updateDevnetCommand: CreateCommandReturnType = createCommand(
  'update',
  'Update the Docker image of a given devnet container image',
  [globalOptions.devnetVersion()],
  async (config) => {
    debug('devnet-update:action')({ config });

    try {
      updateDevnet(config.version);
    } catch (e) {
      console.log(
        chalk.red(
          'Updating devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }
  },
);
