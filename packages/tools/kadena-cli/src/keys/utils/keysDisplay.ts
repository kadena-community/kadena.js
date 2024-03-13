import yaml from 'js-yaml';
import path from 'path';

import {
  KEY_EXT,
  KEY_LEGACY_EXT,
  PLAIN_KEY_DIR,
  PLAIN_KEY_EXT,
  PLAIN_KEY_LEGACY_EXT,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../../constants/config.js';
import { services } from '../../services/index.js';
import {
  maskStringPreservingStartAndEnd,
  sanitizeFilename,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { IPlainKey, IWallet } from './keysHelpers.js';
import type { IKeyPair } from './storage.js';

import { relativeToCwd } from '../../utils/path.util.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';
import { getAllPlainKeys } from './keysHelpers.js';

export async function printPlainKeys(): Promise<void> {
  const plainKeys: IPlainKey[] = await getAllPlainKeys();

  const header: TableHeader = [
    'Alias',
    'Index',
    'Legacy',
    'Public Key',
    'Secret Key',
  ];
  const rows: TableRow[] = [];

  if (plainKeys.length === 0) {
    log.info('No plain keys found');
    return;
  }

  for (const key of plainKeys) {
    rows.push([
      key.alias ?? 'N/A',
      key.index !== undefined ? key.index.toString() : 'N/A',
      key.legacy ? 'Yes' : 'No',
      key.publicKey ?? 'N/A',
      key.secretKey !== undefined
        ? maskStringPreservingStartAndEnd(key.secretKey, 65)
        : 'N/A',
    ]);
  }

  if (rows.length > 0) {
    log.output(log.generateTableString(header, rows));
  } else {
    log.info('No valid keys found');
  }
}

export async function printWalletKeys(wallet: IWallet | null): Promise<void> {
  if (!wallet) return;

  const header: TableHeader = [
    'Filename',
    'Index',
    'Legacy',
    'Public Key',
    'Secret Key',
  ];
  const rows: TableRow[] = [];

  if (wallet.keys.length === 0) {
    log.info(`\nWallet: ${wallet.folder}${wallet.legacy ? ' (legacy)' : ''}`);
    return log.info('No keys');
  }

  for (const key of wallet.keys) {
    const content = await services.filesystem.readFile(
      path.join(WALLET_DIR, wallet.folder, key),
    );
    const parsed: IKeyPair | null =
      content !== null && content !== ''
        ? (yaml.load(content) as IKeyPair)
        : null;

    if (parsed) {
      rows.push([
        key,
        parsed.index !== undefined ? parsed.index.toString() : 'N/A',
        key.includes('legacy') ? 'Yes' : 'No',
        parsed.publicKey ?? 'N/A',
        parsed.secretKey !== undefined
          ? maskStringPreservingStartAndEnd(parsed.secretKey, 65)
          : 'N/A',
      ]);
    }
  }

  if (rows.length > 0) {
    log.info(`\nWallet: ${wallet.folder}${wallet.legacy ? ' (legacy)' : ''}`);
    log.output(log.generateTableString(header, rows));
  } else {
    log.info(`\nWallet: ${wallet.folder}${wallet.legacy ? ' (legacy)' : ''}`);
    log.info('No valid keys found');
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
  printStoredKeys(alias, keyPairs, isLegacy, null, startIndex);
}

/**
 * Prints the filenames of stored HD keys.
 * @param {string} alias - The alias for the keys.
 * @param {IKeyPair[]} keyPairs - Array of key pairs.
 * @param {boolean} isLegacy - Indicates if the keys are in legacy format.
 * @param {number} [startIndex=0] - The starting index for naming the key files.
 */
export function printStoredHdKeys(
  wallet: IWallet,
  alias: string,
  keyPairs: IKeyPair[],
  isLegacy: boolean,
  startIndex: number = 0,
): void {
  printStoredKeys(alias, keyPairs, isLegacy, wallet, startIndex);
}

/**
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
  wallet: IWallet | null,
  startIndex: number = 0,
): void {
  const header: TableHeader = ['Filepath'];
  const rows: TableRow[] = [];

  const ext = wallet
    ? isLegacy
      ? KEY_LEGACY_EXT
      : KEY_EXT
    : isLegacy
    ? PLAIN_KEY_LEGACY_EXT
    : PLAIN_KEY_EXT;

  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  // eslint-disable-next-line @typescript-eslint/naming-convention
  keyPairs.forEach((_, index) => {
    const fileNameIndex = keyPairs.length > 1 ? `-${startIndex + index}` : '';
    const fileName = `${sanitizedAlias}${fileNameIndex}${ext}`;
    const filePath = relativeToCwd(
      path.join(
        wallet ? path.join(WALLET_DIR, wallet.folder) : PLAIN_KEY_DIR,
        fileName,
      ),
    );
    rows.push([filePath]);
  });

  if (rows.length > 0) {
    const message = wallet
      ? 'The HD Key Pair is stored within your keys folder under the filename(s):'
      : 'The Plain Key Pair is stored within your keys folder under the filename(s):';

    log.info(log.color.green(message));
    log.output(log.generateTableString(header, rows));
  } else {
    log.info('No keys found.');
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
  const header: TableHeader = ['Public Key', 'Secret Key'];
  const rows: TableRow[] = keyPairs.map((keyPair) => [
    keyPair.publicKey ?? 'N/A',
    keyPair.secretKey !== undefined
      ? maskStringPreservingStartAndEnd(keyPair.secretKey, 65)
      : 'N/A',
  ]);

  const messagePrefix = legacy === true ? message[0] : message[1];
  log.info(log.color.green(messagePrefix));

  if (rows.length > 0) {
    log.output(log.generateTableString(header, rows));
  } else {
    log.info('No keys to display.');
  }
  log.info('\n');
}

export function displayGeneratedWallet(words: string): void {
  const header: TableHeader = ['Mnemonic Phrase'];
  const rows: TableRow[] = [[words]];

  log.output(log.generateTableString(header, rows));

  log.info(
    log.color.yellow(
      `Please store the mnemonic phrase in a safe place. You will need it to recover your wallet.`,
    ),
  );
  log.info('');
}

export function displayStoredWallet(
  walletName: string,
  isLegacy: boolean,
): void {
  const extension: string = isLegacy ? WALLET_LEGACY_EXT : WALLET_EXT;
  const walletPath = `${WALLET_DIR}/${walletName}/${walletName}${extension}`;

  const header: TableHeader = ['Wallet Storage Location'];
  const rows: TableRow[] = [[relativeToCwd(walletPath)]];

  log.output(log.generateTableString(header, rows));
}
