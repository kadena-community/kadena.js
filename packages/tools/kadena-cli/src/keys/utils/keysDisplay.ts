import chalk from 'chalk';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { clearCLI } from '../../utils/helpers.js';
import {
  getLegacySeeds,
  getPlainKeys,
  getPlainLegacyKeys,
  getSeeds,
} from './keysHelpers.js';
import type { IKeyPair, TSeedContent } from './storage.js';

import {
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
} from '../../constants/config.js';

export function displayKeysConfig(): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.yellow('-'.padEnd(formatLength, '-')));
  };

  const displayHeaderSeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const displayKeys = (
    keyType: string,
    keys: string[],
    isSeed: boolean,
  ): void => {
    displayHeaderSeparator();
    log(chalk.yellow(keyType));
    displayHeaderSeparator();
    if (keys.length > 0) {
      keys.forEach((key) => {
        log(`Filename: ${key}`);
        const filePath = path.join(KEY_DIR, key);
        try {
          const fileContents = readFileSync(filePath, 'utf8');
          if (isSeed) {
            const parsedContents = yaml.load(fileContents) as TSeedContent;
            log(`Seed: ${parsedContents}`);
          } else {
            const parsedContents = yaml.load(fileContents) as IKeyPair;
            log(`Public Key: ${parsedContents.publicKey}`);
            if (parsedContents.privateKey !== undefined) {
              log(`Private Key: ${parsedContents.privateKey}`);
            }
          }
        } catch (error) {
          log(`Error reading key file ${filePath}:`, error);
        }
        displaySeparator();
      });
    } else {
      log('No keys found.');
      displaySeparator();
    }
  };

  // DisplayingSeeds
  const seeds = getSeeds();
  displayKeys('Seeds:', seeds, true);

  // Displaying LegacySeeds
  const seedLegacy = getLegacySeeds();
  if (seedLegacy.length > 0) {
    log('\n');
    displayKeys('Legacy seeds:', seedLegacy, true);
  }

  log('\n');

  // Displaying Plain Keys
  const plainKeys = getPlainKeys();
  displayKeys('Plain keys:', plainKeys, false);

  // Displaying Legacy Plain Keys
  const plainLegacyKeys = getPlainLegacyKeys();
  if (plainLegacyKeys.length > 0) {
    log('\n');
    displayKeys('Plain Legacy keys:', plainLegacyKeys, false);
  }
}

export function displayGeneratedSeeds(
  keysData: Array<{
    publicKey: string;
    privateKey?: string;
    seed?: string;
    filename?: string;
  }>,
): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.yellow('-'.padEnd(formatLength, '-')));
  };

  const displayHeaderSeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  displayHeaderSeparator();
  log(chalk.yellow(`Seeds:`));
  displayHeaderSeparator();

  if (keysData.length > 0) {
    keysData.forEach((keyData, index) => {
      log(`Key ${index + 1}`);
      log(`Filename: ${keyData.filename}`);
      if (keyData.seed !== undefined) {
        log(`Seed: ${keyData.seed}`);
      }
      log(`Public Key: ${keyData.publicKey}`);
      if (keyData.privateKey !== undefined) {
        log(`Private Key: ${keyData.privateKey}`);
      }
      displaySeparator();
    });
  } else {
    log('No keys/seeds created.');
    displaySeparator();
  }
}

export function printStoredPlainKeys(
  alias: string,
  plainKeyPairs: IKeyPair[],
  isLegacy: boolean,
): void {
  console.log(
    chalk.green(
      'The Plain Key Pair is stored within your keys folder under the filename(s):',
    ),
  );
  console.log('\n');

  const ext = isLegacy ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;

  for (let index = 0; index < plainKeyPairs.length; index++) {
    const keyName = index === 0 ? `${alias}${ext}` : `${alias}-${index}${ext}`;
    console.log(chalk.green(`- ${keyName}`));
  }
}

export function displayGeneratedPlainKeys(
  plainKeyPairs: IKeyPair[],
  legacy?: boolean,
): void {
  clearCLI(true);

  // Determine the message prefix based on the 'legacy' flag
  const messagePrefix =
    legacy === true
      ? 'Generated Legacy Plain Key Pair(s): '
      : 'Generated Plain Key Pair(s): ';

  console.log(
    chalk.green(`${messagePrefix}${JSON.stringify(plainKeyPairs, null, 2)}`),
  );
  console.log('\n');
}
