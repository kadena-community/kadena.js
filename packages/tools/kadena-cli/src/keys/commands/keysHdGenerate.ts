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
  keyAlias: string;
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

function displayGeneratedHdKey(words: string, config: IConfig): void {
  const extension: string =
    config.legacy === true ? HDKEY_ENC_LEGACY_EXT : HDKEY_ENC_EXT;

  console.log(chalk.green(`Generated HD Key: ${words}`));
  console.log(
    chalk.yellow(
      `Please store the key phrase in a safe place. You will need it to recover your keys.`,
    ),
  );
  console.log(
    chalk.green(
      `The HD Key (seed) is stored within your keys folder under the alias: ${config.keyAlias}${extension}!`,
    ),
  );
}

export const createGenerateHdKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'hd',
  'generate an HD-key (encrypted seed)',
  [
    globalOptions.keyAlias(),
    globalOptions.keyPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    debug('generate-hd-keys:action')({ config });

    const { words, seed } = await generateKey(config);

    storageService.storeHdKeyByAlias(seed, config.keyAlias, config.legacy);
    clearCLI(true);
    displayGeneratedHdKey(words, config);
  },
);
