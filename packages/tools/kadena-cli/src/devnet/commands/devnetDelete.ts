import debug from 'debug';
import { devnetDeletePrompt } from '../../prompts/devnet.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  getDevnetConfiguration,
  removeDevnetConfiguration,
} from '../utils/devnetHelpers.js';

import chalk from 'chalk';
import { createExternalPrompt } from '../../prompts/generic.js';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import {
  dockerVolumeName,
  guardDocker,
  removeDevnet,
  removeVolume,
} from '../utils/docker.js';

export const deleteDevnetCommand: CreateCommandReturnType = createCommand(
  'delete',
  'Delete devnet',
  [globalOptions.devnetSelect()],
  async (config) => {
    debug('devnet-delete:action')({ config });

    guardDocker();

    const externalPrompt = createExternalPrompt({
      devnetDeletePrompt,
    });
    const deleteDevnet = await externalPrompt.devnetDeletePrompt();

    if (deleteDevnet === 'no') {
      console.log(
        chalk.yellow(
          `\nThe devnet configuration "${config.name}" will not be deleted.\n`,
        ),
      );
      return;
    }

    try {
      removeDevnet(config.name);
      console.log(chalk.green(`Removed devnet container: ${config.name}`));

      const configuration = getDevnetConfiguration(config.name);

      if (configuration?.useVolume === true) {
        removeVolume(config.name);
        console.log(
          chalk.green(`Removed volume: ${dockerVolumeName(config.name)}`),
        );
      }

      console.log(
        chalk.green(
          `Successfully removed devnet container for configuration: ${config.name}`,
        ),
      );

      removeDevnetConfiguration(config);

      console.log(
        chalk.green(
          `Successfully removed devnet configuration: ${config.name}`,
        ),
      );
    } catch (e) {
      console.log(
        chalk.red(
          'Something went wrong during the removal of the devnet container.',
        ),
      );
      return;
    }
  },
);
