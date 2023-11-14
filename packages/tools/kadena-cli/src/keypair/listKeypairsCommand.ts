import debug from 'debug';
import { createCommand } from '../utils/createCommand.js';
import { displayKeypairsConfig } from './keypairHelpers.js';

export const listKeypairsCommand = createCommand(
  'list',
  'List all available keypairs',
  [],
  async (config) => {
    debug('keypair-list:action')({config});

    displayKeypairsConfig();
  },
);
