import {
  HDKEY_ENC_EXT,
  HDKEY_ENC_LEGACY_EXT,
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
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
 * Fetches all encrypted HD key files from the specified directory.
 * @returns {string[]} Array of encrypted HD key filenames without their extensions.
 */
export function getHDKeys(): string[] {
  return getFilesWithExtension(KEY_DIR, HDKEY_ENC_EXT);
}

/**
 * Fetches all encrypted HD key files from the specified directory.
 * @returns {string[]} Array of encrypted HD key filenames without their extensions.
 */
export function getHDLegacyKeys(): string[] {
  return getFilesWithExtension(KEY_DIR, HDKEY_ENC_LEGACY_EXT);
}

/**
 * Fetches all HD key filenames (both standard and legacy) from the specified directory.
 * @returns {string[]} Array of HD key filenames without their extensions.
 */
export function getAllHDKeys(): string[] {
  const hdKeys = getHDKeys();
  const hdLegacyKeys = getHDLegacyKeys();
  return [...hdKeys, ...hdLegacyKeys];
}

export const toHexStr = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex');
