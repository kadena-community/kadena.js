import type { WriteFileOptions } from 'fs';

import yaml from 'js-yaml';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  HDKEY_ENC_EXT,
  HDKEY_ENC_LEGACY_EXT,
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
} from '../../constants/config.js';
import {
  ensureDirectoryExists,
  writeFile,
  writeFileAsync,
} from '../../utils/filesystem.js';
import { sanitizeFilename } from '../../utils/helpers.js';

export type THDKeyContent = string;

export interface IKeyPair {
  publicKey: string;
  privateKey?: string;
}

export type KeyContent = THDKeyContent | IKeyPair;

export async function savePlainKeyByAlias(
  alias: string,
  keyPairs: IKeyPair[],
  legacy: boolean = false,
): Promise<void> {
  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  for (let i = 0; i < keyPairs.length; i++) {
    const keyPair = keyPairs[i];
    let fileName = `${sanitizedAlias}${i > 0 ? `-${i}` : ''}`;
    const ext = legacy ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;
    fileName += ext;
    const filePath = join(KEY_DIR, fileName);

    const data: IKeyPair = { publicKey: keyPair.publicKey };
    if (keyPair.privateKey !== undefined) {
      data.privateKey = keyPair.privateKey;
    }

    await writeFileAsync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
  }
}

/**
 * Retrieves a key pair based on the given alias.
 *
 * @param {string} alias - The alias corresponding to the key file to be fetched.
 * @returns {{publicKey: string; privateKey: string} | undefined} The key pair if found, otherwise undefined.
 */
export function getStoredPlainKeyByAlias(
  alias: string,
  legacy: boolean = false,
): IKeyPair | undefined {
  const ext = legacy === true ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;
  const filePath = join(KEY_DIR, `${alias}${ext}`);
  if (existsSync(filePath)) {
    const keyPair = yaml.load(readFileSync(filePath, 'utf8')) as IKeyPair;
    const result: IKeyPair = {
      publicKey: keyPair.publicKey,
    };

    if (keyPair.privateKey !== undefined) {
      result.privateKey = keyPair.privateKey;
    }
    return result;
  }
  return undefined;
}

/**
 * Loads the public keys from key files based on their aliases.
 * Iterates through files in the key directory, and if a file matches the '.key' extension,
 * its content is parsed, and if it contains a valid public key, it's added to the returned array.
 *
 * @returns {string[]} Array of public keys.
 */
export function getAllPublicKeysFromAliasFiles(): string[] {
  ensureDirectoryExists(KEY_DIR);
  const publicKeys: string[] = [];
  const files = readdirSync(KEY_DIR);

  for (const file of files) {
    if (file.endsWith('.key')) {
      const filePath = join(KEY_DIR, file);
      const keyPair = yaml.load(readFileSync(filePath, 'utf8')) as IKeyPair;

      if (
        typeof keyPair?.publicKey === 'string' &&
        keyPair.publicKey.length > 0
      ) {
        publicKeys.push(keyPair.publicKey);
      }
    }
  }

  return publicKeys;
}

/**
 * Stores the mnemonic phrase or seed to the filesystem.
 *
 * @param {string} words - The mnemonic phrase.
 * @param {string} seed - The seed.
 * @param {string} alias - The name of the file to store the mnemonic or seed in.
 * @param {boolean} hasPassword - Whether a password was used to generate the seed.
 */
export function storeHdKeyByAlias(
  seed: string,
  alias: string,
  legacy: boolean = false,
): void {
  ensureDirectoryExists(KEY_DIR);

  const sanitizedAlias = sanitizeFilename(alias).toLowerCase();
  const aliasExtension = legacy === true ? HDKEY_ENC_LEGACY_EXT : HDKEY_ENC_EXT;
  const storagePath = join(KEY_DIR, `${sanitizedAlias}${aliasExtension}`);

  writeFile(
    storagePath,
    // Dump the seed as a plain string instead of a folded block scalar
    yaml.dump(seed, { lineWidth: -1 }),
    'utf8' as WriteFileOptions,
  );
}

/* @param {string} keyAlias - The alias of the key file to read.
 * @returns {THDKeyContent | IKeyPair | undefined} The parsed content of the key file, or undefined if the file does not exist.
 * @throws {Error} Throws an error if reading the file fails.
 */
export function readKeyFileContent(keyAlias: string): KeyContent | undefined {
  const filePath = join(KEY_DIR, keyAlias);

  if (!existsSync(filePath)) {
    console.error(`File ${keyAlias} does not exist.`);
    return undefined;
  }

  try {
    const fileContents = readFileSync(filePath, 'utf8');
    return yaml.load(fileContents) as THDKeyContent | IKeyPair;
  } catch (error) {
    throw new Error(`Error reading file ${keyAlias}: ${error}`);
  }
}

/**
 * Asynchronously wraps the readKeyFileContent function.
 * @param {string} keyAlias - The alias of the key file to read.
 * @returns {Promise<THDKeyContent | IKeyPair | undefined>} A promise that resolves with the parsed content of the key file, or undefined if the file does not exist.
 */
export async function readKeyFileContentAsync(
  keyAlias: string,
): Promise<THDKeyContent | IKeyPair | undefined> {
  return new Promise((resolve, reject) => {
    try {
      const result = readKeyFileContent(keyAlias);
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
    return readdirSync(dir).filter((filename) =>
      filename.toLowerCase().endsWith(extension),
    );
  } catch (error) {
    console.error(`Error reading directory for extension ${extension}:`, error);
    return [];
  }
}
