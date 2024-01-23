import { displayNetworksConfig } from '../utils/networkDisplay.js';

import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

export const listNetworksCommand: (program: Command, version: string) => void =
  createCommand('list', 'List all available networks', [], async (config) => {
    debug('network-list:action')({ config });
    displayNetworksConfig();
  });
