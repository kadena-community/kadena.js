import { displayDevnetsConfig } from './devnetHelpers.js';

import debug from 'debug';
import { createCommand } from '../utils/createCommand.js';

export const listDevnetsCommand = createCommand(
  'list',
  'List all available devnets',
  [],
  async (config) => {
    debug('devnet-list:action')({config});

    displayDevnetsConfig();
  },
);
