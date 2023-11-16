import debug from 'debug';
import { devnetOverwritePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';
import { writeDevnet } from './devnetHelpers.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';

export const manageDevnetsCommand = createCommand(
  'manage',
  'Manage devnets',
  [
    globalOptions.devnetSelect(),
    globalOptions.devnetPort(),
    globalOptions.devnetUseVolume(),
    globalOptions.devnetMountPactFolder(),
    globalOptions.devnetVersion(),
  ],
  async (config) => {
    debug('devnet-manage:action')({config});

    const overwrite = await devnetOverwritePrompt(config.name);
    if (overwrite === 'no') {
      console.log(chalk.yellow(`\nThe devnet configuration "${config.name}" will not be updated.\n`));
      return;
    }

    writeDevnet(config);

    console.log(chalk.green(`\nThe devnet configuration "${config.name}" has been updated.\n`));
  },
);
