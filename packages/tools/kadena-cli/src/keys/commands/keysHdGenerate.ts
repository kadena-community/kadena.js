import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

import { HDKEY_ENC_EXT } from '../../constants/config.js';
import { clearCLI } from '../../utils/helpers.js'; // clearCLI
import * as cryptoService from '../utils/service.js';
import * as storageService from '../utils/storage.js';

import chalk from 'chalk';

import { globalOptions } from '../../utils/globalOptions.js';

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'hd',
  'generate an HD-key or public-private key-pair',
  [globalOptions.keyPassword(), globalOptions.keyFilename()],
  async (config) => {
    debug('generate-hd-keys:action')({ config });

    const { words, seed } = await cryptoService.generateSeed(
      config.keyPassword,
    );
    storageService.storeHdKey(seed, config.keyFilename);

    clearCLI(true);
    console.log(chalk.green(`Generated HD Key: ${words}`));
    console.log(
      chalk.red(
        `The HD Key is stored within your keys folder under the filename: ${config.keyFilename}${HDKEY_ENC_EXT} !`,
      ),
    );
  },
);
