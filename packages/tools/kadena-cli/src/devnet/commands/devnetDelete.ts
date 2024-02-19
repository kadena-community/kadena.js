import { devnetDeletePrompt } from '../../prompts/devnet.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  getDevnetConfiguration,
  removeDevnetConfiguration,
} from '../utils/devnetHelpers.js';

import { createExternalPrompt } from '../../prompts/generic.js';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
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
    log.debug('devnet-delete:action', { config });

    guardDocker();

    const externalPrompt = createExternalPrompt({
      devnetDeletePrompt,
    });
    const deleteDevnet = await externalPrompt.devnetDeletePrompt();

    if (deleteDevnet === 'no') {
      log.warning(
        `\nThe devnet configuration "${config.name}" will not be deleted.\n`,
      );
      return;
    }

    try {
      removeDevnet(config.name);
      log.info(log.color.green(`Removed devnet container: ${config.name}`));

      const configuration = await getDevnetConfiguration(config.name);

      if (configuration?.useVolume === true) {
        removeVolume(config.name);
        log.info(
          log.color.green(`Removed volume: ${dockerVolumeName(config.name)}`),
        );
      }

      log.info(
        log.color.green(
          `Successfully removed devnet container for configuration: ${config.name}`,
        ),
      );

      await removeDevnetConfiguration(config);

      log.info(
        log.color.green(
          `Successfully removed devnet configuration: ${config.name}`,
        ),
      );
    } catch (e) {
      log.error(
        'Something went wrong during the removal of the devnet container.',
      );
      return;
    }
  },
);
