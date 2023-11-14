import debug from 'debug';
import { keypairDeletePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { removeKeypair } from './keypairHelpers.js';

export const deleteKeypairCommand = createCommand(
  'delete',
  'Delete keypair',
  [globalOptions.keypairSelect()],
  async (config) => {
    debug('keypair-delete:action')({config});

    const overwrite = await keypairDeletePrompt(config.name);
    if (overwrite === 'no') {
      console.log(chalk.yellow(`\nThe keypair "${config.name}" will not be deleted.\n`));
      return;
    }

    removeKeypair(config);

    console.log(chalk.green(`\nThe keypair "${config.name}" has been deleted.\n`));
  },
);
