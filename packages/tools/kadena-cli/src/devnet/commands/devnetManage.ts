import debug from 'debug';
import { devnetOverwritePrompt } from '../../prompts/devnet.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { writeDevnet } from '../utils/devnetHelpers.js';

import chalk from 'chalk';
import { createExternalPrompt } from '../../prompts/generic.js';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';

export const manageDevnetsCommand: CreateCommandReturnType = createCommand(
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
    debug('devnet-manage:action')({ config });

    const externalPrompt = createExternalPrompt({
      devnetOverwritePrompt,
    });
    const overwrite = await externalPrompt.devnetOverwritePrompt();

    if (overwrite === 'no') {
      console.log(
        chalk.yellow(
          `\nThe devnet configuration "${config.name}" will not be updated.\n`,
        ),
      );
      return;
    }

    writeDevnet(config);

    console.log(
      chalk.green(
        `\nThe devnet configuration "${config.name}" has been updated.\n`,
      ),
    );
  },
);
