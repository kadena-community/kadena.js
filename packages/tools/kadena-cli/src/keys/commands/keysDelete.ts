import type { Command } from 'commander';
import { Option } from 'commander';
import { z } from 'zod';

import { PLAIN_KEY_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { log } from '../../utils/logger.js';
import { select } from '../../utils/prompts.js';
import { keysOptions } from '../keysOptions.js';

export const deleteKey = async (key: string): Promise<CommandResult<{}>> => {
  try {
    await services.filesystem.deleteFile(`${PLAIN_KEY_DIR}/${key}`);
    return { success: true, data: {} };
  } catch (error) {
    return { success: false, errors: ['Failed to delete key'] };
  }
};

export const deleteAllKeys = async (): Promise<CommandResult<{}>> => {
  try {
    await services.filesystem.deleteDirectory(PLAIN_KEY_DIR);
    return { success: true, data: {} };
  } catch (error) {
    return { success: false, errors: ['Failed to delete all keys'] };
  }
};

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
  option: new Option('--confirm', 'Confirm key deletion'),
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
      log.warning('\nNo key(s) were deleted.\n');
      return;
    }

    log.debug('delete-keys:action', { config });
    if (config.keyFiles === 'all') {
      const result = await deleteAllKeys();
      assertCommandError(result);
      log.info(log.color.green('\nAll keys have been deleted.\n'));
    } else {
      if (config.keyFiles === null) {
        throw new Error(`Key: ${config.keyFiles} does not exist.`);
      }

      const result = await deleteKey(config.keyFiles);
      assertCommandError(result);

      const keyText =
        config.keyFiles === 'all'
          ? 'all keys have been deleted'
          : `the key: "${config.keyFiles}" has been deleted`;

      log.info(log.color.green(`\n${keyText}\n`));
    }
  },
);
