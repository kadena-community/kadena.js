import type { Command } from 'commander';

import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { displayNetworksConfig } from '../utils/networkDisplay.js';

export const listNetworksCommand: (program: Command, version: string) => void =
  createCommand('list', 'List all available networks', [], async () => {
    log.debug('network-list:action');
    await displayNetworksConfig();
  });
