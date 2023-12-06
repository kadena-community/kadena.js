import chalk from 'chalk';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { clearCLI } from '../../utils/helpers.js';
import {
  getHDKeys,
  getHDLegacyKeys,
  getPlainKeys,
  getPlainLegacyKeys,
} from './keysHelpers.js';
import type { IKeyPair, THDKeyContent } from './storage.js';

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
    isHD: boolean,
  ): void => {
    displayHeaderSeparator();
    log(chalk.yellow(`${keyType} keys:`));
    displayHeaderSeparator();
    if (keys.length > 0) {
      keys.forEach((key) => {
        log(`Filename: ${key}`);
        const filePath = path.join(KEY_DIR, key);
        try {
          const fileContents = readFileSync(filePath, 'utf8');
          if (isHD) {
            const parsedContents = yaml.load(fileContents) as THDKeyContent;
            log(`HD Seed: ${parsedContents}`);
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

  // Displaying HD Keys
  const hdKeys = getHDKeys();
  displayKeys('HD', hdKeys, true);

  // Displaying Legacy HD Keys
  const hdLegacyKeys = getHDLegacyKeys();
  if (hdLegacyKeys.length > 0) {
    log('\n');
    displayKeys('HD Legacy', hdLegacyKeys, true);
  }

  log('\n');

  // Displaying Plain Keys
  const plainKeys = getPlainKeys();
  displayKeys('Plain', plainKeys, false);

  // Displaying Legacy Plain Keys
  const plainLegacyKeys = getPlainLegacyKeys();
  if (plainLegacyKeys.length > 0) {
    log('\n');
    displayKeys('Plain Legacy', plainLegacyKeys, false);
  }
}

export function displayGeneratedHdKeys(
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
  log(chalk.yellow(`Generated HD Keys:`));
  displayHeaderSeparator();

  if (keysData.length > 0) {
    keysData.forEach((keyData, index) => {
      log(`Key ${index + 1}`);
      log(`Filename: ${keyData.filename}`);
      if (keyData.seed !== undefined) {
        log(`HD Seed: ${keyData.seed}`);
      }
      log(`Public Key: ${keyData.publicKey}`);
      if (keyData.privateKey !== undefined) {
        log(`Private Key: ${keyData.privateKey}`);
      }
      displaySeparator();
    });
  } else {
    log('No keys generated.');
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

  const ext = isLegacy ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;

  for (let index = 0; index < plainKeyPairs.length; index++) {
    const keyName = index === 0 ? `${alias}${ext}` : `${alias}-${index}${ext}`;
    console.log(chalk.green(`- ${keyName}`));
  }
}

export function displayGeneratedPlainKeys(plainKeyPairs: IKeyPair[]): void {
  clearCLI(true);
  console.log(
    chalk.green(
      `Generated Plain Key Pair(s): ${JSON.stringify(plainKeyPairs, null, 2)}`,
    ),
  );
}
