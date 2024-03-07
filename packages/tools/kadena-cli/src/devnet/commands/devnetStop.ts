import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';
import { guardDocker, stopDevnet } from '../utils/docker.js';

export const stopDevnetCommand = createCommand(
  'stop',
  'Stop devnet',
  [devnetOptions.devnetSelect()],
  async (option) => {
    const config = await option.name();
    log.debug('devnet-stop:action', config);

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
