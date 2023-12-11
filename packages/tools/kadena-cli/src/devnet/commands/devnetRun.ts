import debug from 'debug';
import { globalOptions } from '../../utils/globalOptions.js';

import chalk from 'chalk';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { guardDocker, runDevnet } from '../utils/docker.js';

export const runDevnetCommand: CreateCommandReturnType = createCommand(
  'run',
  'Run devnet',
  [globalOptions.devnet()],
  async (config) => {
    debug('devnet-run:action')({ config });

    guardDocker();

    runDevnet(config.devnetConfig);

    console.log(
      chalk.green(
        `\nThe devnet configuration "${config.devnet}" is running.\n`,
      ),
    );
  },
);
