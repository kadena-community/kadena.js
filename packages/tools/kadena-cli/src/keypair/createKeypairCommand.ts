import { ensureFileExists } from '../utils/filesystem.js';

import debug from 'debug';
import path from 'path';

import chalk from 'chalk';
import type { Command } from 'commander';
import { defaultKeypairsPath } from '../constants/keypairs.js';
import * as cryptoService from '../keys/utils/service.js';
import { keypairOverwritePrompt } from '../prompts/index.js';
import { createCommand } from '../utils/createCommand.js';
import { globalOptions } from '../utils/globalOptions.js';
import { writeKeypair } from './keypairHelpers.js';

export const createKeypairCommand: (program: Command, version: string) => void =
  createCommand(
    'create',
    'Create keypair',
    [globalOptions.keypairName()],
    async (config) => {
      debug('keypair-create:action')({ config });

      const filePath = path.join(defaultKeypairsPath, `${config.name}.yaml`);

      if (ensureFileExists(filePath)) {
        const overwrite = await keypairOverwritePrompt(config.name);
        if (overwrite === 'no') {
          console.log(
            chalk.yellow(
              `\nThe existing keypair "${config.name}" will not be updated.\n`,
            ),
          );
          return;
        }
      }

      const plainKeyPairs = cryptoService.generateKeyPairsFromRandom();
      const plainKeyPair = plainKeyPairs[0];
      const keypairConfig = {
        ...config,
        ...plainKeyPair,
      };

      writeKeypair(keypairConfig);

      console.log(
        chalk.green(`\nThe keypair "${config.name}" has been saved.\n`),
      );
    },
  );
