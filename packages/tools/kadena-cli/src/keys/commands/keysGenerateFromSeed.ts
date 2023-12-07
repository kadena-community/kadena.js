import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromSeed } from '../utils/keySharedKeyGen.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';

import * as storageService from '../utils/storage.js';

import { kadenaDecrypt } from '@kadena/hd-wallet';
import chalk from 'chalk';
import ora from 'ora';
import { clearCLI } from '../../utils/helpers.js';

export const createGenerateFromSeedCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'from-seed',
  'create key(s) from encrypted seed',
  [
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.keySeed(),
    globalOptions.keyPassword(),
    globalOptions.keyAmount({ isOptional: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-from-seed:action')({ config });

      const loading = ora('Generating from seed..').start();
      const isLegacy =
        kadenaDecrypt(config.keyPassword, config.keySeed).byteLength >= 128;

      const result = {
        ...config,
        legacy: isLegacy,
      };

      const keys = await generateFromSeed(result as IKeysConfig);
      loading.succeed('Completed');
      displayGeneratedPlainKeys(keys);

      await storageService.savePlainKeyByAlias(
        config.keyAlias,
        keys,
        config.legacy,
      );
      printStoredPlainKeys(config.keyAlias, keys, config.legacy);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
