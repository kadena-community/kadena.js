import {
  kadenaEncrypt,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '@kadena/hd-wallet';
import {
  kadenaGenMnemonic as LegacyKadenaGenMnemonic,
  kadenaMnemonicToRootKeypair as legacykadenaMnemonicToRootKeypair,
} from '@kadena/hd-wallet/chainweaver';

import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

import { SEED_EXT, SEED_LEGACY_EXT } from '../../constants/config.js';
import { clearCLI } from '../../utils/helpers.js'; // clearCLI
import * as storageService from '../utils/storage.js';

import chalk from 'chalk';

import { globalOptions } from '../../utils/globalOptions.js';

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
    seed = kadenaEncrypt(config.keyPassword, buffer);
  } else {
    words = kadenaGenMnemonic();
    seed = await kadenaMnemonicToSeed(config.keyPassword, words);
  }

  return { words, seed };
}

function displayGeneratedSeed(words: string, config: IConfig): void {
  const extension: string = config.legacy === true ? SEED_LEGACY_EXT : SEED_EXT;

  console.log(chalk.green(`Mnemonic phrase: ${words}`));
  console.log(
    chalk.yellow(
      `Please store the key phrase in a safe place. You will need it to recover your keys.`,
    ),
  );
  console.log('\n');
  console.log(
    chalk.green(
      `The seed is stored within your keys folder under the alias: ${config.keyAlias}${extension}!`,
    ),
  );
}

export const createGenerateSeedCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'create-seed',
  'create a ecrypted seed',
  [
    globalOptions.keyAlias(),
    globalOptions.keyPassword(),
    globalOptions.legacy({ isOptional: true, disableQuestion: true }),
  ],
  async (config) => {
    clearCLI();
    try {
      debug('generate-seed:action')({ config });

      const { words, seed } = await generateKey(config);

      storageService.storeSeedByAlias(seed, config.keyAlias, config.legacy);
      clearCLI(true);
      displayGeneratedSeed(words, config);
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
