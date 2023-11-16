import { defaultDevnetsPath } from '../constants/devnets.js';
import { ensureFileExists } from '../utils/filesystem.js';
import { writeDevnet } from './devnetHelpers.js';

import debug from 'debug';
import path from 'path';

import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import chalk from 'chalk';
import { devnetOverwritePrompt } from '../constants/prompts.js';

export const createDevnetCommand = createCommand(
  'create',
  'Create devnet',
  [
    globalOptions.devnetName(),
    globalOptions.devnetPort(),
    globalOptions.devnetUseVolume(),
    globalOptions.devnetMountPactFolder(),
    globalOptions.devnetVersion(),
  ],
  async (config) => {
    debug('devnet-create:action')({config});

    const filePath = path.join(defaultDevnetsPath, `${config.name}.yaml`);

    if (ensureFileExists(filePath)) {
      const overwrite = await devnetOverwritePrompt(config.name);
      if (overwrite === 'no') {
        console.log(chalk.yellow(`\nThe existing devnet configuration "${config.name}" will not be updated.\n`));
        return;
      }
    }

    writeDevnet(config);

    console.log(chalk.green(`\nThe devnet configuration "${config.name}" has been saved.\n`));
  },
);
