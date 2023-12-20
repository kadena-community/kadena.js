import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import ora from 'ora';

import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { IKeysConfig } from '../utils/keySharedKeyGen.js';
import { generateFromWallet } from '../utils/keySharedKeyGen.js';
import {
  displayGeneratedHdKeys,
  printStoredHdKeys,
} from '../utils/keysDisplay.js';
import {
  extractStartIndex,
  parseKeyIndexOrRange,
} from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'gen-hd',
  'generate public/secret key pair(s) from your wallet',
  [
    globalOptions.keyWalletSelect(),
    globalOptions.keyGenFromChoice(),
    globalOptions.keyAlias(),
    globalOptions.securityPassword(),
    globalOptions.keyIndexOrRange({ isOptional: true }),
  ],
  async (config) => {
    try {
      debug('generate-hdkeys:action')({ config });
      const { wallet: keyWallet, fileName } = config.keyWallet;
      const isLegacy = fileName.includes('.legacy');

      const parseKeyIndexOrRangeRes = parseKeyIndexOrRange(
        config.keyIndexOrRange,
      );

      const startIndex = extractStartIndex(parseKeyIndexOrRangeRes);

      const result = {
        ...config,
        keyWallet,
        keyIndexOrRange: parseKeyIndexOrRangeRes,
        legacy: isLegacy,
      };

      const loadingSpinner = ora('Generating keys..').start();

      const shouldGenerateSecretKeys =
        config.keyGenFromChoice === 'genPublicSecretKey' ||
        config.keyGenFromChoice === 'genPublicSecretKeyDec';

      const keys = await generateFromWallet(
        result as IKeysConfig,
        shouldGenerateSecretKeys,
      );
      loadingSpinner.succeed('Completed');

      displayGeneratedHdKeys(keys);
      await storageService.saveKeyByAlias(
        result.keyAlias,
        keys,
        result.legacy,
        fileName,
        startIndex,
      );
      printStoredHdKeys(result.keyAlias, keys, result.legacy, startIndex);
    } catch (error) {
      console.error(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
