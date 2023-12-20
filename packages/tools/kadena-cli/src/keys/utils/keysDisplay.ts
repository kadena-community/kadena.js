import chalk from 'chalk';
import { readFileSync, readdirSync } from 'fs';
import yaml from 'js-yaml';

import type { IWalletConfig } from './keysHelpers.js';

import type { IKeyPair } from './storage.js';

import {
  KEY_EXT,
  KEY_LEGACY_EXT,
  PLAIN_KEY_EXT,
  PLAIN_KEY_LEGACY_EXT,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../../constants/config.js';

import { join } from 'path';

import { removeAfterFirstDot } from '../../utils/filesystem.js';
import { getKeysFromWallet, getLegacyKeysFromWallet } from './keysHelpers.js';

export function displaySelectedWallet(name: string): void {
  const walletName = removeAfterFirstDot(name);
  const formatLength = 80; // Maximum width for the display
  // Wallet header with background color
  console.log(
    chalk.black.bgGreen(`\n Wallet: ${walletName.padEnd(formatLength)}\n`),
  );

  displayKeysInSection(
    walletName,
    getKeysFromWallet(removeAfterFirstDot(walletName)),
    chalk.green('Standard Keys:'),
  );
  displayKeysInSection(
    walletName,
    getLegacyKeysFromWallet(walletName),
    chalk.green('Legacy Keys:'),
  );
}

function displayKeysInSection(
  walletName: string,
  keys: string[],
  sectionTitle: string,
): void {
  const formatLength = 80; // Maximum width for the display
  console.log(sectionTitle);
  console.log(chalk.yellow('-'.padEnd(formatLength, '-'))); // Header separator

  if (keys.length === 0) {
    console.log('No keys found.');
    return;
  }

  keys.forEach((keyFileName) => {
    const filePath = join(WALLET_DIR, walletName, keyFileName);
    try {
      const fileContents = readFileSync(filePath, 'utf8');
      const parsedContents = yaml.load(fileContents) as IKeyPair;
      console.log(chalk.yellow(`Filename: ${keyFileName}`));
      console.log(`Public Key: ${parsedContents.publicKey}`);
      if (parsedContents.secretKey !== undefined) {
        console.log(`Secret Key: ${parsedContents.secretKey}`);
      }
    } catch (error) {
      console.log(`Error reading key file ${filePath}:`, error);
    }
    console.log(chalk.yellow('-'.padEnd(formatLength, '-'))); // Key separator
  });
}

export function displayAllWallets(): void {
  const walletDirs = readdirSync(WALLET_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (walletDirs.length === 0) {
    console.log(chalk.red('No wallets found.'));
    return;
  }

  walletDirs.forEach(displaySelectedWallet);
}

/**
 * Prints the filenames of stored plain keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 */
export function printStoredPlainKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, false);
}

/**
 * Prints the filenames of stored HD keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 */
export function printStoredHdKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, true);
}

/**
 * Prints the filenames of stored keys, determining the filename based on alias, key pair index, and legacy status.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {boolean} isHd - Indicates if the keys are HD (Hierarchical Deterministic) or not.
 */
export function printStoredKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  isHd: boolean,
): void {
  const ext = isHd
    ? isLegacy
      ? KEY_LEGACY_EXT
      : KEY_EXT
    : isLegacy
    ? PLAIN_KEY_LEGACY_EXT
    : PLAIN_KEY_EXT;

  const message = isHd
    ? 'The HD Key Pair is stored within your keys folder under the filename(s):'
    : 'The Plain Key Pair is stored within your keys folder under the filename(s):';

  console.log(chalk.green(message));
  console.log('\n');

  for (let index = 0; index < keyPairs.length; index++) {
    const keyName = index === 0 ? `${alias}${ext}` : `${alias}-${index}${ext}`;
    console.log(chalk.green(`- ${keyName}`));
  }
}

/**
 * Displays generated plain key pairs in a formatted manner.
 * @param {IKeyPair[]} plainKeyPairs - Array of plain key pairs.
 * @param {boolean} [legacy] - Optional flag to indicate if the keys are legacy keys.
 */
export function displayGeneratedPlainKeys(
  plainKeyPairs: IKeyPair[],
  legacy?: boolean,
): void {
  return displayGeneratedKeys(
    plainKeyPairs,
    ['Generated Legacy Plain Key Pair(s): ', 'Generated Plain Key Pair(s): '],
    legacy,
  );
}

/**
 * Displays generated HD (Hierarchical Deterministic) key pairs in a formatted manner.
 * @param {IKeyPair[]} plainKeyPairs - Array of HD key pairs.
 * @param {boolean} [legacy] - Optional flag to indicate if the keys are legacy keys.
 */
export function displayGeneratedHdKeys(
  plainKeyPairs: IKeyPair[],
  legacy?: boolean,
): void {
  return displayGeneratedKeys(
    plainKeyPairs,
    ['Generated Legacy Key Pair(s): ', 'Generated Key Pair(s): '],
    legacy,
  );
}

/**
 * Generic function to display generated keys with a custom message.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {[string, string]} message - Tuple containing two strings: the message for legacy keys and the message for non-legacy keys.
 * @param {boolean} [legacy] - Optional flag to indicate if the keys are legacy keys.
 */
export function displayGeneratedKeys(
  keyPairs: IKeyPair[],
  message: [string, string],
  legacy?: boolean,
): void {
  const messagePrefix = legacy === true ? message[0] : message[1];

  console.log(
    chalk.green(`${messagePrefix}${JSON.stringify(keyPairs, null, 2)}`),
  );
  console.log('\n');
}

export function displayGeneratedWallet(words: string): void {
  console.log(chalk.green(`Mnemonic phrase: ${words}`));

  console.log(
    chalk.yellow(
      `Please store the key phrase in a safe place. You will need it to recover your keys.`,
    ),
  );
  console.log('\n');
}

export function displayStoredWallet(
  walletName: string,
  isLegacy: boolean,
): void {
  const extension: string = isLegacy === true ? WALLET_LEGACY_EXT : WALLET_EXT;

  console.log(
    chalk.green(
      `Your wallet was stored at: ${WALLET_DIR}/${walletName}/${walletName}${extension}`,
    ),
  );
  console.log('\n');
}
