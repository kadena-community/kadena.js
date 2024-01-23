import debug from 'debug';
import { globalOptions } from '../../utils/globalOptions.js';

import chalk from 'chalk';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { guardDocker, stopDevnet } from '../utils/docker.js';

export const stopDevnetCommand: CreateCommandReturnType = createCommand(
  'stop',
  'Stop devnet',
  [globalOptions.devnetSelect()],
  async (config) => {
    debug('devnet-stop:action')({ config });

    guardDocker();

    try {
      stopDevnet(config.name);

      console.log(
        chalk.green(
          `\nThe devnet configuration "${config.name}" has been stopped.\n`,
        ),
      );
    } catch (e) {
      console.log(
        chalk.red(
          'Stopping devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }
  },
);
