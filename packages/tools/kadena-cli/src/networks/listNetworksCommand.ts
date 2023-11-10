import { displayNetworksConfig } from './networksHelpers.js';

import debug from 'debug';
import { createCommand } from '../utils/createCommand.js';

export const listNetworksCommand = createCommand(
  'list',
  'List all available networks',
  [],
  async (config) => {
    debug('network-list:action')({config});

    displayNetworksConfig();
  },
);
