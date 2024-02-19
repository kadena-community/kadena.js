import { globalOptions } from '../../utils/globalOptions.js';

import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { guardDocker, runDevnet } from '../utils/docker.js';

export const runDevnetCommand: CreateCommandReturnType = createCommand(
  'run',
  'Run devnet',
  [globalOptions.devnet()],
  async (config) => {
    log.debug('devnet-run:action', { config });

    guardDocker();

    runDevnet(config.devnetConfig);

    log.info(
      log.color.green(
        `\nThe devnet configuration "${config.devnet}" is running.\n`,
      ),
    );
  },
);
