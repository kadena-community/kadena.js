import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { displayDevnetsConfig } from '../utils/devnetDisplay.js';

export const listDevnetsCommand = createCommand(
  'list',
  'List all available devnets',
  [],
  async () => {
    log.debug('devnet-list:action');
    await displayDevnetsConfig();
  },
);
