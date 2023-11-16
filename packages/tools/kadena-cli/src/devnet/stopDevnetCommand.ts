import debug from 'debug';
import { globalOptions } from '../utils/globalOptions.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { isDockerInstalled, stopDevnet } from './docker.js';

export const stopDevnetCommand = createCommand(
  'stop',
  'Stop devnet',
  [globalOptions.devnetSelect()],
  async (config) => {
    debug('devnet-stop:action')({config});

    if (!isDockerInstalled()) {
      console.log(
        chalk.red(
          'Stopping devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }

    stopDevnet(config.name);

    console.log(chalk.green(`\nThe devnet configuration "${config.name}" has been stopped.\n`));
  },
);
