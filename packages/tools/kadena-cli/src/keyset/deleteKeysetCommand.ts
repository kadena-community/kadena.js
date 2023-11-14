import debug from 'debug';
import { keysetDeletePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { removeKeyset } from './keysetHelpers.js';

export const deleteKeysetCommand = createCommand(
  'delete',
  'Delete keyset',
  [globalOptions.keysetSelect()],
  async (config) => {
    debug('keyset-delete:action')({config});

    const overwrite = await keysetDeletePrompt(config.name);
    if (overwrite === 'no') {
      console.log(chalk.yellow(`\nThe keyset "${config.name}" will not be deleted.\n`));
      return;
    }

    removeKeyset(config);

    console.log(chalk.green(`\nThe keyset "${config.name}" has been deleted.\n`));
  },
);
