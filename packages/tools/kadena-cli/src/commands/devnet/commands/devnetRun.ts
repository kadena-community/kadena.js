import { createCommand } from '../../../utils/createCommand.js';
import { log } from '../../../utils/logger.js';
import { devnetOptions } from '../devnetOptions.js';
import { guardDocker, runDevnet } from '../utils/docker.js';

export const runDevnetCommand = createCommand(
  'run',
  'Run devnet',
  [devnetOptions.devnet()],
  async (option) => {
    const config = await option.devnet();
    log.debug('devnet-run:action', config);

    guardDocker();

    runDevnet(config.devnetConfig);

    log.info(
      log.color.green(
        `\nThe devnet configuration "${config.devnet}" is running.\n`,
      ),
    );
  },
);
