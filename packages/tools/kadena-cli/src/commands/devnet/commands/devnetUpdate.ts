import { createCommand } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';
import { guardDocker, updateDevnet } from '../utils/docker.js';

export const updateDevnetCommand = createCommand(
  'update',
  'Update the Docker image of a given devnet container image',
  [devnetOptions.devnetVersion()],
  async (option) => {
    const config = await option.version();
    log.debug('devnet-update:action', config);

    guardDocker();

    try {
      updateDevnet(config.version);
    } catch (e) {
      log.error(
        'Updating devnet requires Docker. Please install Docker and try again.',
      );
      return;
    }
  },
);
