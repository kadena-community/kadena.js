import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { displayDevnetsConfig } from '../utils/devnetDisplay.js';

export const listDevnetsCommand: CreateCommandReturnType = createCommand(
  'list',
  'List all available devnets',
  [],
  async (config) => {
    log.debug('devnet-list:action', { config });

    await displayDevnetsConfig();
  },
);
