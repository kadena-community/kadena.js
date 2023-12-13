import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';
import {
  displayGeneratedHdKeys,
  printStoredHdKeys,
} from '../utils/keysDisplay.js';

import * as storageService from '../utils/storage.js';

import { kadenaDecrypt } from '@kadena/hd-wallet';
import chalk from 'chalk';
import ora from 'ora';
import { clearCLI } from '../../utils/helpers.js';

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'gen-hd',
  'generate public/private key pair(s) fom your wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.keyPassword(),
    globalOptions.keyAmount({ isOptional: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-keys:action')({ config });
      const { wallet: keyWallet, fileName } = config.keyWallet;

      const isLegacy =
        kadenaDecrypt(config.keyPassword, keyWallet).byteLength >= 128;

      const result = {
        ...config,
        keyWallet: keyWallet,
        legacy: isLegacy,
      };

      const loading = ora('Generating keys..').start();

      const keys = await generateFromWallet(
        result as IKeysConfig,
        config.keyGenFromChoice === 'genPublicPrivateKey',
      );
      loading.succeed('Completed');
      displayGeneratedHdKeys(keys);

      await storageService.saveKeyByAlias(
        result.keyAlias,
        keys,
        result.legacy,
        fileName,
      );
      return printStoredHdKeys(result.keyAlias, keys, result.legacy);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
