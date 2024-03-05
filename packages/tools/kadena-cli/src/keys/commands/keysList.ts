import type { Command } from 'commander';

import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { printPlainKeys } from '../utils/keysDisplay.js';

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('list', 'List key(s)', [], async () => {
  log.debug('list-keys:action');

  await printPlainKeys();
});
