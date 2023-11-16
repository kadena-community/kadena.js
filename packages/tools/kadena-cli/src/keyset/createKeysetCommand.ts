import { ensureFileExists } from '../utils/filesystem.js';

import debug from 'debug';
import path from 'path';

import chalk from 'chalk';
import type { Command } from 'commander';
import { defaultKeysetsPath } from '../constants/keysets.js';
import { keysetOverwritePrompt } from '../prompts/index.js';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import { writeKeyset } from './keysetHelpers.js';

export const createKeysetCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'Create keyset',
    [
      globalOptions.keysetName(),
      globalOptions.keysetPredicate(),
      globalOptions.publicKeysFromKeypairs(),
      globalOptions.otherPublicKeys(),
    ],
    async (config) => {
      debug('keyset-create:action')({ config });

      const filePath = path.join(defaultKeysetsPath, `${config.name}.yaml`);

      if (ensureFileExists(filePath)) {
        const overwrite = await keysetOverwritePrompt();
        if (overwrite === 'no') {
          console.log(
            chalk.yellow(
              `\nThe existing keyset "${config.name}" will not be updated.\n`,
            ),
          );
          return;
        }
      }

      writeKeyset(config);

      console.log(
        chalk.green(`\nThe keyset "${config.name}" has been saved.\n`),
      );
    },
  );
