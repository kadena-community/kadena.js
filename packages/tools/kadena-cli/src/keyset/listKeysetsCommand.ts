import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../utils/createCommand.js';
import { displayKeysetsConfig } from './keysetHelpers.js';

export const listKeysetsCommand: (program: Command, version: string) => void =
  createCommand('list', 'List all available keysets', [], async (config) => {
    debug('keyset-list:action')({ config });

    displayKeysetsConfig();
  });
