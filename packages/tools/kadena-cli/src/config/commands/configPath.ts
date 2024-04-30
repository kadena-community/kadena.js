import type { Command } from 'commander';
import { services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';

export const createConfigPathCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'path',
  'Print the currently used config location',
  [],
  async () => {
    log.debug('config path');

    const kadenaDir = services.config.getDirectory();
    if (kadenaDir === null) {
      throw new KadenaError('no_kadena_directory');
    }

    log.info(log.color.green('Currently using kadena config directory in:'));
    log.output(kadenaDir, {
      directory: kadenaDir,
    });
  },
);
