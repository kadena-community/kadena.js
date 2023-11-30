import type { WriteFileOptions } from 'fs';
import yaml from 'js-yaml';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  HDKEY_ENC_EXT,
  HDKEY_ENC_LEGACY_EXT,
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
} from '../../constants/config.js';
import { ensureDirectoryExists, writeFile } from '../../utils/filesystem.js';
import { sanitizeFilename } from '../../utils/helpers.js';

interface IKeyPair {
  publicKey: string;
  privateKey: string;
}

/**
 * Saves the given key pair to multiple files based on the provided amount.
 * Only subsequent files will be postfixed with an index if the amount is greater than 1.
 *
 * @param {string} alias - The base alias for the key pair.
 * @param {string} publicKey - The public key.
 * @param {string} privateKey - The private key.
 * @param {number} [amount=1] - The number of files to write.
 */
export function savePlainKeyByAlias(
  alias: string,
  publicKey: string,
  privateKey: string,
  amount: number = 1,
  legacy: boolean = false,
): void {
  ensureDirectoryExists(KEY_DIR);
  const sanitizedAlias = sanitizeFilename(alias).toLocaleLowerCase();

  for (let i = 0; i < amount; i++) {
    let fileName = sanitizedAlias;

    // Append index to the filename if it's not the first file.
    if (i > 0) {
      fileName += `-${i}`;
    }

    const ext = legacy === true ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;

    fileName += ext;

    const filePath = join(KEY_DIR, fileName);

    const data = {
      publicKey,
      privateKey,
    };

    writeFile(
      filePath,
      yaml.dump(data, { lineWidth: -1 }),
      'utf8' as WriteFileOptions,
    );
  }
}

/**
 * Retrieves a key pair based on the given alias.
 *
 * @param {string} alias - The alias corresponding to the key file to be fetched.
 * @returns {{publicKey: string; secretKey: string} | undefined} The key pair if found, otherwise undefined.
 */
export function getStoredPlainKeyByAlias(
  alias: string,
  legacy: boolean = false,
): { publicKey: string; secretKey: string } | undefined {
  const ext = legacy === true ? PLAINKEY_LEGACY_EXT : PLAINKEY_EXT;
  const filePath = join(KEY_DIR, `${alias}${ext}`);
  if (existsSync(filePath)) {
    const keyPair = yaml.load(readFileSync(filePath, 'utf8')) as IKeyPair;
    return {
      publicKey: keyPair.publicKey,
      secretKey: keyPair.privateKey,
    };
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
  ensureDirectoryExists(KEY_DIR); // Ensure this function is defined elsewhere in your code
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
 * @param {string} fileName - The name of the file to store the mnemonic or seed in.
 * @param {boolean} hasPassword - Whether a password was used to generate the seed.
 */
export function storeHdKey(
  seed: string,
  fileName: string,
  legacy: boolean = false,
): void {
  ensureDirectoryExists(KEY_DIR);

  const sanitizedFilename = sanitizeFilename(fileName).toLowerCase();
  const fileExtension = legacy === true ? HDKEY_ENC_LEGACY_EXT : HDKEY_ENC_EXT;
  const storagePath = join(KEY_DIR, `${sanitizedFilename}${fileExtension}`);

  writeFile(
    storagePath,
    // Dump the seed as a plain string instead of a folded block scalar
    yaml.dump(seed, { lineWidth: -1 }),
    'utf8' as WriteFileOptions,
  );
}

/**
 * Retrieves the stored mnemonic phrase from the filesystem.
 *
 * @param {string} fileName - The name of the file where the mnemonic is stored.
 * @returns {string | undefined} The stored mnemonic phrase, or undefined if not found.
 */
export function getStoredHdKey(fileName: string): string | undefined {
  const storagePath = join(KEY_DIR, fileName);

  if (existsSync(storagePath)) {
    return yaml.load(readFileSync(storagePath, 'utf8')) as string;
  }
  return undefined;
}
