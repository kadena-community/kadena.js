import { devnetDeletePrompt } from '../../prompts/devnet.js';
import {
  getDevnetConfiguration,
  removeDevnetConfiguration,
} from '../utils/devnetHelpers.js';

import { createExternalPrompt } from '../../prompts/generic.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';
import {
  dockerVolumeName,
  guardDocker,
  removeDevnet,
  removeVolume,
} from '../utils/docker.js';

export const deleteDevnetCommand = createCommand(
  'delete',
  'Delete devnet',
  [devnetOptions.devnetSelect()],
  async (option) => {
    const config = await option.name();
    log.debug('devnet-delete:action', config);

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
  },
);
