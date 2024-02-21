import yaml from 'js-yaml';
import path from 'path';

import {
  KEY_EXT,
  KEY_LEGACY_EXT,
  PLAIN_KEY_EXT,
  PLAIN_KEY_LEGACY_EXT,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../../constants/config.js';
import { services } from '../../services/index.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { IWallet } from './keysHelpers.js';
import type { IKeyPair } from './storage.js';

// eslint-disable-next-line @rushstack/no-new-null
export async function printWalletKeys(wallet: IWallet | null): Promise<void> {
  if (!wallet) return;

  const formatLength = 80;

  log.info(
    log.color.black.bgGreen(
      `\n${` Wallet: ${wallet.folder}${
        wallet.legacy ? ' (legacy)' : ''
      }`.padEnd(formatLength)}\n`,
    ),
  );

  if (wallet.keys.length === 0) {
    return log.info('No keys');
  }

  log.info(log.color.yellow('-'.padEnd(formatLength, '-')));
  for (const key of wallet.keys) {
    const content = await services.filesystem.readFile(
      path.join(WALLET_DIR, wallet.folder, key),
    );
    const parsed = content !== null ? (yaml.load(content) as IKeyPair) : null;
    log.info(log.color.yellow(`Filename: ${key}`));
    log.info(`Public Key: ${parsed?.publicKey}`);
    if (typeof parsed?.secretKey === 'string') {
      log.info(`Secret Key: ${parsed.secretKey}`);
    }
    log.info(log.color.yellow('-'.padEnd(formatLength, '-')));
  }
}

/**
 * Prints the filenames of stored plain keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredPlainKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  startIndex: number = 0,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, false, startIndex);
}

/**
 * Prints the filenames of stored HD keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredHdKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  startIndex: number = 0,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, true, startIndex);
}

/**
 * Prints the filenames of stored keys, determining the filename based on alias, key pair index, and legacy status.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {boolean} isHd - Indicates if the keys are HD (Hierarchical Deterministic) or not.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredKeys(
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  isHd: boolean,
  startIndex: number = 0,
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

  log.info(log.color.green(message));
  log.info('\n');

  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  for (let index = 0; index < keyPairs.length; index++) {
    const fileNameIndex = index > 0 ? `-${index}` : '';
    const fileName = `${sanitizedAlias}${fileNameIndex}${ext}`;
    log.info(log.color.green(`- ${fileName}`));
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

  log.info(
    log.color.green(`${messagePrefix}${JSON.stringify(keyPairs, null, 2)}`),
  );
  log.info('\n');
}

export function displayGeneratedWallet(words: string): void {
  log.info(log.color.green(`Mnemonic phrase: ${words}`));

  log.info(
    log.color.yellow(
      `Please store the key phrase in a safe place. You will need it to recover your keys.`,
    ),
  );
  log.info('\n');
}

export function displayStoredWallet(
  walletName: string,
  isLegacy: boolean,
): void {
  const extension: string = isLegacy === true ? WALLET_LEGACY_EXT : WALLET_EXT;

  log.info(
    log.color.green(
      `Your wallet was stored at: ${WALLET_DIR}/${walletName}/${walletName}${extension}`,
    ),
  );
  log.info('\n');
}
