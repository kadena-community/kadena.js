import debug from 'debug';
import { existsSync } from 'fs';
import { WALLET_DIR } from '../../constants/config.js';
import { createExternalPrompt } from '../../prompts/generic.js';
import {
  confirmDeleteAllKeysPrompt,
  keyDeletePrompt,
} from '../../prompts/keys.js';
import {
  deleteAllFilesInDirAsync,
  removeFile,
} from '../../utils/filesystem.js';
import { globalOptions } from '../../utils/globalOptions.js';

import chalk from 'chalk';
import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';

export const createDeleteKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'delete',
  'delete key(s)',
  [globalOptions.key()],
  async (config) => {
    try {
      debug('delete:action')({ config });

      const externalPrompt = createExternalPrompt({
        keyDeletePrompt,
        confirmDeleteAllKeysPrompt,
      });

      if (config.key === 'all') {
        const confirmDelete = await externalPrompt.confirmDeleteAllKeysPrompt();
        if (confirmDelete === 'no') {
          console.log(chalk.yellow('\nNo keys were deleted.\n'));
          return;
        }

        await deleteAllFilesInDirAsync(WALLET_DIR, ['.seed']);
        return;
      }

      const shouldDelete = await externalPrompt.keyDeletePrompt(config.key);

      if (shouldDelete === 'no') {
        console.log(
          chalk.yellow(`\nThe key file "${config.key}" will not be deleted.\n`),
        );
        return;
      }

      const filePath = `${WALLET_DIR}/${config.key}`;
      if (!existsSync(filePath)) {
        console.error(chalk.red(`File ${config.key} does not exist.`));
        return;
      }

      removeFile(filePath);
      console.log(
        chalk.green(`\nThe key file "${config.key}" has been deleted.\n`),
      );
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
