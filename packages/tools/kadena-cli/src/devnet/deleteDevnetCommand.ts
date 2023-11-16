import debug from 'debug';
import { devnetDeletePrompt } from '../constants/prompts.js';
import { globalOptions } from '../utils/globalOptions.js';
import { getDevnetConfiguration, removeDevnetConfiguration } from './devnetHelpers.js';

import chalk from 'chalk';
import { createCommand } from '../utils/createCommand.js';
import { dockerVolumeName, isDockerInstalled, removeDevnet, removeVolume } from './docker.js';

export const deleteDevnetCommand = createCommand(
  'delete',
  'Delete devnet',
  [globalOptions.devnetSelect()],
  async (config) => {
    debug('devnet-delete:action')({config});

    const deleteDevnet = await devnetDeletePrompt(config.name);
    if (deleteDevnet === 'no') {
      console.log(chalk.yellow(`\nThe devnet configuration "${config.name}" will not be deleted.\n`));
      return;
    }

    if (!isDockerInstalled()) {
      console.log(
        chalk.red(
          'Stopping devnet requires Docker. Please install Docker and try again.',
        ),
      );
      return;
    }

    removeDevnet(config.name);
    console.log(chalk.green(`Removed devnet container: ${config.name}`));

    const configuration = getDevnetConfiguration(config.name);

    if (configuration?.useVolume) {
      removeVolume(config.name);
      console.log(
        chalk.green(
          `Removed volume: ${dockerVolumeName(config.name)}`,
        ),
      );
    }

    console.log(chalk.green(`Successfully removed devnet container for configuration: ${config.name}`));

    removeDevnetConfiguration(config);

    console.log(chalk.green(`Successfully removed devnet configuration: ${config.name}`));
  },
);
