import {
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
  SEED_EXT,
  SEED_LEGACY_EXT,
} from '../../constants/config.js';

import { getFilesWithExtension } from './storage.js';

/**
 * Fetches all plain key files from the specified directory.
 * @returns {string[]} Array of plain key filenames without their extensions.
 */
export function getPlainKeys(): string[] {
  return getFilesWithExtension(KEY_DIR, PLAINKEY_EXT);
}

/**
 * Fetches all plain key files from the specified directory.
 * @returns {string[]} Array of plain key filenames without their extensions.
 */
export function getPlainLegacyKeys(): string[] {
  return getFilesWithExtension(KEY_DIR, PLAINKEY_LEGACY_EXT);
}

/**
 * Fetches all encryptedSeed files from the specified directory.
 * @returns {string[]} Array of encryptedSeed filenames without their extensions.
 */
export function getSeeds(): string[] {
  return getFilesWithExtension(KEY_DIR, SEED_EXT);
}

/**
 * Fetches all encryptedSeed files from the specified directory.
 * @returns {string[]} Array of encryptedSeed filenames without their extensions.
 */
export function getLegacySeeds(): string[] {
  return getFilesWithExtension(KEY_DIR, SEED_LEGACY_EXT);
}

/**
 * Fetches allSeed filenames (both standard and legacy) from the specified directory.
 * @returns {string[]} Array ofSeed filenames without their extensions.
 */
export function getAllSeeds(): string[] {
  const seeds = getSeeds();
  const legacySeeds = getLegacySeeds();
  return [...seeds, ...legacySeeds];
}

/**
 * Converts a Uint8Array to a hexadecimal string.
 *
 * This function takes a Uint8Array and returns its equivalent hexadecimal string representation.
 *
 * @param {Uint8Array} bytes - The Uint8Array to be converted.
 * @returns {string} The hexadecimal string representation of the input bytes.
 */
export const toHexStr = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex');

/**
 * Converts a hexadecimal string to a Uint8Array.
 *
 * This function takes a hexadecimal string and returns its equivalent Uint8Array representation.
 *
 * @param {string} hexStr - The hexadecimal string to be converted.
 * @returns {Uint8Array} The Uint8Array representation of the input hexadecimal string.
 */
export const fromHexStr = (hexStr: string): Uint8Array =>
  new Uint8Array(Buffer.from(hexStr, 'hex'));
