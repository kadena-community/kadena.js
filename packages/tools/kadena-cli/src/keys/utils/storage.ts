import type { EncryptedString } from '@kadena/hd-wallet';
import yaml from 'js-yaml';
import type { WriteFileOptions } from 'node:fs';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
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
import {
  ensureDirectoryExists,
  removeAfterFirstDot,
  writeFile,
  writeFileAsync,
} from '../../utils/filesystem.js';
import { sanitizeFilename } from '../../utils/helpers.js';

export type TSeedContent = string;

export interface IKeyPair {
  publicKey: string;
  privateKey?: EncryptedString | string;
}

export type KeyContent = TSeedContent | IKeyPair;

export async function savePlainKeyByAlias(
  alias: string,
  keyPairs: IKeyPair[],
  legacy: boolean = false,
): Promise<void> {
  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  for (let i = 0; i < keyPairs.length; i++) {
    const keyPair = keyPairs[i];
    let fileName = `${sanitizedAlias}${i > 0 ? `-${i}` : ''}`;
    const ext = legacy ? PLAIN_KEY_LEGACY_EXT : PLAIN_KEY_EXT;
    fileName += ext;
    const filePath = join(PLAIN_KEY_DIR, fileName);

    const data: IKeyPair = { publicKey: keyPair.publicKey };
    if (keyPair.privateKey !== undefined) {
      data.privateKey = keyPair.privateKey;
    }

    await writeFileAsync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
  }
}

/**
 * Saves key pairs by alias in a specific wallet directory.
 *
 * @param {string} alias - The alias for the key pair.
 * @param {IKeyPair[]} keyPairs - Array of key pairs to save.
 * @param {boolean} legacy - Whether to use legacy format.
 * @param {string} [walletName=""] - The name of the wallet (optional).
 */
export async function saveKeyByAlias(
  alias: string,
  keyPairs: IKeyPair[],
  legacy: boolean = false,
  walletName: string = '',
): Promise<void> {
  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();
  const sanitizedWalletName = sanitizeFilename(removeAfterFirstDot(walletName));

  const baseDir = sanitizedWalletName
    ? join(WALLET_DIR, sanitizedWalletName)
    : WALLET_DIR;

  for (let i = 0; i < keyPairs.length; i++) {
    const keyPair = keyPairs[i];
    let fileName = `${sanitizedAlias}${i > 0 ? `-${i}` : ''}`;
    const ext = legacy ? KEY_LEGACY_EXT : KEY_EXT;
    fileName += ext;
    const filePath = join(baseDir, fileName);

    const data: IKeyPair = { publicKey: keyPair.publicKey };
    if (keyPair.privateKey !== undefined) {
      data.privateKey = keyPair.privateKey;
    }

    await writeFileAsync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
  }
}

/**

/**
 * Stores the seed in the filesystem in a directory specific to the alias.
 *
 * @param {string} seed - The seed.
 * @param {string} alias - The alias used to name the file and directory.
 * @param {boolean} legacy - Whether to use the legacy file extension.
 */
export function storeWallet(
  seed: string,
  alias: string,
  legacy: boolean = false,
): void {
  const sanitizedAlias = sanitizeFilename(alias).toLowerCase();
  const walletSubDir = join(WALLET_DIR, sanitizedAlias);
  ensureDirectoryExists(walletSubDir);

  const aliasExtension = legacy ? WALLET_LEGACY_EXT : WALLET_EXT;
  const storagePath = join(walletSubDir, `${sanitizedAlias}${aliasExtension}`);

  writeFile(
    storagePath,
    yaml.dump(seed, { lineWidth: -1 }),
    'utf8' as WriteFileOptions,
  );
}

/**
 * Reads the content of a key file and parses it.
 * @param {string} filePath - The complete file path of the key file to be read.
 * @returns {TSeedContent | IKeyPair | undefined} The parsed content of the key file, or undefined if the file does not exist.
 * @throws {Error} Throws an error if reading the file fails.
 */
export function readKeyFileContent(
  filePath: string,
): TSeedContent | IKeyPair | undefined {
  if (!existsSync(filePath)) {
    console.error(`File at path ${filePath} does not exist.`);
    return undefined;
  }

  try {
    const fileContents = readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as TSeedContent | IKeyPair;
  } catch (error) {
    throw new Error(`Error reading file at path ${filePath}: ${error}`);
  }
}

/**
 * Asynchronously wraps the readKeyFileContent function.
 * @param {string} filePath - The complete file path of the key file to be read.
 * @returns {Promise<TSeedContent | IKeyPair | undefined>} A promise that resolves with the parsed content of the key file, or undefined if the file does not exist.
 */
export async function readKeyFileContentAsync(
  filePath: string,
): Promise<TSeedContent | IKeyPair | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const result = readKeyFileContent(filePath);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Fetches all files with a specific extension from a given directory.
 * @param {string} dir - The directory path from which files are to be read.
 * @param {string} extension - The file extension to filter by.
 * @returns {string[]} Array of filenames with the specified extension, without the extension itself.
 */
export function getFilesWithExtension(
  dir: string,
  extension: string,
): string[] {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  try {
    return readdirSync(dir).filter((filename) => {
      // When searching for standard wallet files, exclude legacy wallet files
      if (extension === WALLET_EXT && filename.endsWith(WALLET_LEGACY_EXT)) {
        return false;
      }
      return filename.toLowerCase().endsWith(extension);
    });
  } catch (error) {
    console.error(`Error reading directory for extension ${extension}:`, error);
    return [];
  }
}
