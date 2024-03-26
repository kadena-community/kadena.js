import type { Command } from 'commander';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { printPlainKeys } from '../utils/keysDisplay.js';

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List key(s)',
  [globalOptions.directory({ disableQuestion: true })],
  async (option) => {
    const { directory } = await option.directory();
    log.debug('list-keys:action', { directory });

    const plainKeys = await services.plainKey.list(directory);
    await printPlainKeys(plainKeys);
  },
);
