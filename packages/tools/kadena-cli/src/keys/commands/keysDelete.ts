import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { log } from '../../utils/logger.js';
import { select } from '../../utils/prompts.js';
import { keysOptions } from '../keysOptions.js';

const confirmDelete = createOption({
  key: 'confirm',
  defaultIsOptional: false,
  async prompt(args) {
    if (typeof args.keyFiles !== 'string') return false;

    const message =
      args.keyFiles === 'all'
        ? 'Are you sure you want to delete ALL keys?'
        : `Are you sure you want to delete the key: "${args.keyFiles}"?`;

    return await select({
      message,
      choices: [
        {
          value: true,
          name: args.keyFiles === 'all' ? 'Yes, delete all keys' : 'Yes',
        },
        { value: false, name: 'No' },
      ],
    });
  },
  validation: z.boolean(),
  option: new Option('-y --confirm', 'Confirm key deletion'),
});

export const createDeleteKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'Delete key(s) from your local filesystem',
  [keysOptions.keysFiles(), confirmDelete()],
  async (option, { collect }) => {
    const config = await collect(option);
    if (config.confirm !== true) {
      log.warning('\nNo key(s) were deleted.');
      return;
    }

    log.debug('delete-keys:action', { config });
    if (config.keyFiles === 'all') {
      await services.plainKey.deleteAll();
      log.info(log.color.green('\nAll keys have been deleted.'));
    } else {
      if (config.keyFiles === null) {
        throw new Error(`Key: ${config.keyFiles} does not exist.`);
      }

      await services.plainKey.delete(config.keyFiles);

      log.info(
        log.color.green(
          `\nthe key: "${config.keyFiles.alias}" has been deleted`,
        ),
      );
    }
  },
);
