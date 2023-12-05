import type { EncryptedString } from '@kadena/hd-wallet';
import { kadenaGenKeypairFromSeed } from '@kadena/hd-wallet';
import { kadenaGenKeypair } from '@kadena/hd-wallet/chainweaver';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  displayGeneratedPlainKeys,
  printStoredPlainKeys,
} from '../utils/keysDisplay.js';
import { fromHexStr, toHexStr } from '../utils/keysHelpers.js';
import * as storageService from '../utils/storage.js';

import ora from 'ora';
interface IConfig {
  keyGenFromHdChoice: string;
  keyAlias?: string;
  keySeed?: string;
  keyPassword: string;
  keyAmount?: number;
}

const defaultAmount: number = 1;

async function generateFromHd(
  config: IConfig,
): Promise<storageService.IKeyPair[]> {
  if (
    !['genPublicKeyFromHDKey', 'genPublicPrivateKeysFromHDKey'].includes(
      config.keyGenFromHdChoice,
    )
  ) {
    throw new Error('Invalid choice');
  }

  return handlePublicPrivateKeysFromHDKey(
    config,
    config.keyGenFromHdChoice === 'genPublicPrivateKeysFromHDKey',
  );
}

async function handlePublicPrivateKeysFromHDKey(
  config: IConfig,
  showPrivateKey: boolean = false,
): Promise<Array<{ publicKey: string; privateKey?: string }>> {
  if (config.keySeed === undefined) {
    throw new Error('Seed is required for this option.');
  }

  const keys: Array<storageService.IKeyPair> = [];
  const amount =
    config.keyAmount !== undefined ? config.keyAmount : defaultAmount;

  for (let index = 0; index < amount; index++) {
    let keyGenResult: [Uint8Array | string, Uint8Array | string];

    if (config.keySeed.length >= 256) {
      keyGenResult = await kadenaGenKeypair(
        config.keyPassword,
        fromHexStr(config.keySeed), // config.keySeed,
        index,
      );
    } else {
      keyGenResult = await kadenaGenKeypairFromSeed(
        config.keyPassword,
        config.keySeed as EncryptedString,
        index,
      );
    }

    const publicKey =
      typeof keyGenResult[0] === 'string'
        ? keyGenResult[0]
        : toHexStr(keyGenResult[0]);
    const encryptedPrivateKey =
      typeof keyGenResult[1] === 'string'
        ? keyGenResult[1]
        : toHexStr(keyGenResult[1]);

    const keyPair: storageService.IKeyPair = {
      publicKey,
      ...(showPrivateKey && { privateKey: encryptedPrivateKey }),
    };

    keys.push(keyPair);
  }

  return keys;
}

export const createGenerateFromHdCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'from-hd',
  'Generate key(s) from HD key (encrypted seed)',
  [
    globalOptions.keyGenFromHdChoice(),
    globalOptions.keyAlias(),
    globalOptions.keySeed(),
    globalOptions.keyPassword(),
    globalOptions.keyAmount({ isOptional: true }),
  ],
  async (config) => {
    debug('generate-from-hd:action')({ config });
    const loading = ora('Generating from seed..').start();
    try {
      const keys = await generateFromHd(config as IConfig);
      loading.succeed('Completed');
      displayGeneratedPlainKeys(keys);

      const isLegacy = config.keySeed.length >= 256;

      await storageService.savePlainKeyByAlias(config.keyAlias, keys, isLegacy);
      printStoredPlainKeys(config.keyAlias, keys, config.legacy);
    } catch (error) {
      loading.fail('Operation failed');
      console.error(`Error: ${error instanceof Error ? error.message : error}`);
    }
  },
);
