import debug from 'debug';
import { globalOptions } from '../utils/globalOptions.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { isDockerInstalled, runDevnet, stopDevnet } from './docker.js';

export const runDevnetCommand = createCommand(
  'run',
  'Run devnet',
  [globalOptions.devnet()],
  async (config) => {
    debug('devnet-run:action')({config});

    if (!isDockerInstalled()) {
      console.log(
        chalk.red(
          'Running devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }

    runDevnet(config.devnetConfig);

    console.log(chalk.green(`\nThe devnet configuration "${config.devnet}" is running.\n`));
  },
);
