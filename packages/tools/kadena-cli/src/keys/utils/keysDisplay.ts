import chalk from 'chalk';
import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import {
  getHDKeys,
  getHDLegacyKeys,
  getPlainKeys,
  getPlainLegacyKeys,
} from './keysHelpers.js';

import { KEY_DIR } from '../../constants/config.js';

interface IHDKeyContent {
  seed: string;
}

interface IPlainKeyContent {
  publicKey: string;
  privateKey: string;
}

export function displayKeysConfig(): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const displayHeaderSeparator = (): void => {
    log(chalk.yellow('-'.padEnd(formatLength, '-')));
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
            const parsedContents = yaml.load(fileContents) as IHDKeyContent;
            log(`HD Seed: ${parsedContents}`);
          } else {
            const parsedContents = yaml.load(fileContents) as IPlainKeyContent;
            log(`Public Key: ${parsedContents.publicKey}`);
            // Uncomment the next line if you want to display the private key
            // log(`Private Key: ${parsedContents.privateKey}`);
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
