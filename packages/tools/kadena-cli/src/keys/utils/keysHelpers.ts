import {
  HDKEY_ENC_EXT,
  HDKEY_ENC_LEGACY_EXT,
  KEY_DIR,
  PLAINKEY_EXT,
  PLAINKEY_LEGACY_EXT,
} from '../../constants/config.js';

import { existsSync, mkdirSync, readdirSync } from 'fs';

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

export const toHexStr = (bytes: Uint8Array): string =>
  Buffer.from(bytes).toString('hex');
