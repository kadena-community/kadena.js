import debug from 'debug';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { displayDevnetsConfig } from '../utils/devnetDisplay.js';

export const listDevnetsCommand: CreateCommandReturnType = createCommand(
  'list',
  'List all available devnets',
  [],
  async (config) => {
    debug('devnet-list:action')({ config });

    await displayDevnetsConfig();
  },
);
