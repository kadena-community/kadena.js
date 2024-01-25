import { defaultDevnetsPath } from '../../constants/devnets.js';
import { writeDevnet } from '../utils/devnetHelpers.js';

import debug from 'debug';
import path from 'path';

import chalk from 'chalk';
import { devnetOverwritePrompt } from '../../prompts/devnet.js';
import { createExternalPrompt } from '../../prompts/generic.js';
import { services } from '../../services/index.js';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const createDevnetCommand: CreateCommandReturnType = createCommand(
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
    debug('devnet-create:action')({ config });

    const filePath = path.join(defaultDevnetsPath, `${config.name}.yaml`);

    if (await services.filesystem.fileExists(filePath)) {
      const externalPrompt = createExternalPrompt({
        devnetOverwritePrompt,
      });
      const overwrite = await externalPrompt.devnetOverwritePrompt();
      if (overwrite === 'no') {
        console.log(
          chalk.yellow(
            `\nThe existing devnet configuration "${config.name}" will not be updated.\n`,
          ),
        );
        return;
      }
    }

    await writeDevnet(config);

    console.log(
      chalk.green(
        `\nThe devnet configuration "${config.name}" has been saved.\n`,
      ),
    );
  },
);
