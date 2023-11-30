import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '@kadena/hd-wallet';
import {
  kadenaGenMnemonic as LegacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

import { HDKEY_ENC_EXT, HDKEY_ENC_LEGACY_EXT } from '../../constants/config.js';
import { clearCLI } from '../../utils/helpers.js'; // clearCLI
import * as storageService from '../utils/storage.js';

import chalk from 'chalk';

import { globalOptions } from '../../utils/globalOptions.js';
import { toHexStr } from '../utils/keysHelpers.js';

interface IConfig {
  keyPassword: string;
  keyFilename: string;
  legacy?: boolean;
}

async function generateKey(
  config: IConfig,
): Promise<{ words: string; seed: string }> {
  let words: string;
  let seed: string;

  if (config.legacy === true) {
    words = LegacyKadenaGenMnemonic();
    const buffer = await legacykadenaMnemonicToRootKeypair(
      config.keyPassword,
      words,
    );
    seed = toHexStr(buffer);
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(config.keyPassword, words);
  }

  return { words, seed };
}

function displayGeneratedKey(words: string, config: IConfig): void {
  const extension: string =
    config.legacy === true ? HDKEY_ENC_LEGACY_EXT : HDKEY_ENC_EXT;

  console.log(chalk.green(`Generated HD Key: ${words}`));
  console.log(
    chalk.red(
      `The HD Key is stored within your keys folder under the filename: ${config.keyFilename}${extension}!`,
    ),
  );
}

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'hd',
  'generate an HD-key or public-private key-pair',
  [
    globalOptions.keyPassword(),
    globalOptions.keyFilename(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config: IConfig) => {
    debug('generate-hd-keys:action')({ config });

    const { words, seed } = await generateKey(config);

    storageService.storeHdKey(seed, config.keyFilename, config.legacy);
    clearCLI(true);
    displayGeneratedKey(words, config);
  },
);
