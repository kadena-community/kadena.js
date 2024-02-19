import { globalOptions } from '../../utils/globalOptions.js';

import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { guardDocker, stopDevnet } from '../utils/docker.js';

export const stopDevnetCommand: CreateCommandReturnType = createCommand(
  'stop',
  'Stop devnet',
  [globalOptions.devnetSelect()],
  async (config) => {
    log.debug('devnet-stop:action', { config });

    guardDocker();

    try {
      stopDevnet(config.name);

      log.info(
        log.color.green(
          `\nThe devnet configuration "${config.name}" has been stopped.\n`,
        ),
      );
    } catch (e) {
      log.error(
        'Stopping devnet requires Docker. Please install Docker and try again.',
      );
      return;
    }
  },
);
