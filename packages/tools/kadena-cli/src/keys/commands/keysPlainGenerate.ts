import { kadenaEncrypt, kadenaKeyPairsFromRandom } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import chalk from 'chalk';
import type { Command } from 'commander';
import { randomBytes } from 'crypto';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { clearCLI } from '../../utils/helpers.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import { fromHexStr, toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

interface IGeneratePlainKeysCommandConfig {
  keyAlias: string;
  keyAmount?: number;
  keyPassword: string;
  legacy?: boolean;
}

const defaultAmount: number = 1;

async function generateKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<storageService.IKeyPair[]> {
  if (config.legacy === true) {
    return generateLegacyKeyPairs(config, amount);
  } else {
    const randomKeyPairs = await kadenaKeyPairsFromRandom(amount);
    return randomKeyPairs.map((keyPair) => {
      const encryptedPrivateKey = kadenaEncrypt(
        config.keyPassword,
        fromHexStr(keyPair.secretKey),
      );
      return {
        publicKey: keyPair.publicKey,
        privateKey: encryptedPrivateKey,
      } as storageService.IKeyPair;
    });
  }
}

async function generateLegacyKeyPairs(
  config: IGeneratePlainKeysCommandConfig,
  amount: number,
): Promise<storageService.IKeyPair[]> {
  const keyPairs: storageService.IKeyPair[] = [];
  const password = '';
  const rootKey = randomBytes(128);

  for (let i = 0; i < amount; i++) {
    const [publicKey, privateKey] = await kadenaGenKeypair(
      password,
      rootKey,
      i,
    );

    const encyptedPrivateKey = kadenaEncrypt(config.keyPassword, privateKey);

    keyPairs.push({
      publicKey: toHexStr(publicKey),
      privateKey: encyptedPrivateKey,
    });
  }

  return keyPairs;
}

export const createGeneratePlainKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'from-random',
  'create a plain key from random non-persisted seed',
  [
    globalOptions.keyAlias(),
    globalOptions.keyPassword(),
    globalOptions.keyAmount({ isOptional: true }),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-plain-key:action')({ config });
      const amount =
        config.keyAmount !== undefined && config.keyAmount !== ''
          ? config.keyAmount
          : defaultAmount;
      const keys = await generateKeyPairs(config, amount);

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
