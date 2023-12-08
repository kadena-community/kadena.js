import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { displayKeysConfig } from '../utils/keysDisplay.js';

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('list', 'list key(s)', [], async (config) => {
  debug('list-keys:action')({ config });
  displayKeysConfig();
});
