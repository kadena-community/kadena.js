import yaml from 'js-yaml';
import { join } from 'node:path';
import sanitizeFilename from 'sanitize-filename';

import {
  KEY_EXT,
  KEY_LEGACY_EXT,
  PLAIN_KEY_DIR,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { IKeyPair } from './storage.js';
import { getFilesWithExtension } from './storage.js';

export interface IWalletConfig {
  securityPassword: string;
  keyWallet: string;
  legacy?: boolean;
}

export interface IWallet {
  folder: string;
  legacy: boolean;
  wallet: string;
  keys: string[];
}

/**
 * Ensures that the wallet directory exists. If the directory does not exist,
 * the process is terminated and exits.
 */
export async function ensureWalletExists(): Promise<void> {
  if (!(await services.filesystem.directoryExists(WALLET_DIR))) {
    console.error(`No Wallet created yet. Please create a wallet first.`);
    process.exit(1);
  }
}

/**
 * Helper method to get all information about a wallet
 * @param wallet wallet name without extension
 * @returns
 */
export async function getWallet(walletFile: string): Promise<IWallet | null> {
  // Determine type of wallet
  const walletNameParts = walletFile.split('.');
  const isLegacy =
    walletNameParts.length === 3 &&
    walletNameParts[1] === 'legacy' &&
    walletNameParts[2] === 'wallet';
  const isRegular =
    walletNameParts.length === 2 && walletNameParts[1] === 'wallet';

  if (!isRegular && !isLegacy) {
    console.trace(
      `Invalid wallet file given to getWallet: "${walletFile}", expected full file name`,
    );
    return null;
  }

  // const walletName = walletNameParts[0];
  const walletName = sanitizeFilename(walletNameParts[0]).toLocaleLowerCase();
  const walletDir = join(WALLET_DIR, walletName);
  const fileExists = await services.filesystem.fileExists(
    join(walletDir, walletFile),
  );
  if (!fileExists) return null;

  const files = await services.filesystem.readDir(walletDir);

  const keys = files
    .filter((file) => file.endsWith(KEY_EXT))
    .filter((file) => isLegacy === file.includes(KEY_LEGACY_EXT));

  return {
    folder: walletName,
    wallet: walletFile,
    legacy: isLegacy,
    keys,
  };
}

export async function getWalletContent(
  walletPath: string,
): Promise<string | null> {
  const wallet = await getWallet(walletPath);
  if (!wallet) return null;
  return await services.filesystem.readFile(
    join(WALLET_DIR, wallet.folder, wallet.wallet),
  );
}

export type IWalletKey = {
  alias: string;
  key: string;
  index: number;
  wallet: IWallet;
} & IKeyPair;

/**
 * This method throws if key is not found because we expect getWallet to have been used
 * which means the key must exist on the filesystem
 * @param wallet result of getWallet
 * @param key key as present in wallet.keys array
 * @returns key information
 */
export const getWalletKey = async (
  wallet: IWallet,
  key: string,
): Promise<IWalletKey> => {
  const file = await services.filesystem.readFile(
    join(WALLET_DIR, wallet.folder, key),
  );
  const parsed = yaml.load(file ?? '') as {
    publicKey?: string;
    secretKey?: string;
  };

  if (parsed.publicKey === undefined) {
    throw new Error(
      `Public key not found for ${key} in wallet ${wallet.folder}`,
    );
  }

  const index =
    Number(
      (parsed as { index?: string }).index ??
        (key.match(/-([0-9]+)\.key$/)?.[1] as string),
    ) || 0;
  const alias = key.replace('.key', '').split('-').slice(0, 1).join('-');
  return {
    wallet,
    key,
    alias,
    index,
    publicKey: parsed.publicKey,
    secretKey: parsed.secretKey,
  };
};

/**
 * Fetches all key files (non-legacy) from a specified wallet directory.
 *
 * This function retrieves all files with the standard key extension (.key by default)
 * from the given wallet directory.
 *
 * @param {string} walletName - The name of the wallet directory to search within.
 * @returns {string[]} An array of plain key filenames without their extensions.
 */
export async function getKeysFromWallet(walletName: string): Promise<string[]> {
  return await getFilesWithExtension(join(WALLET_DIR, walletName), KEY_EXT);
}

/**
 * Fetches all legacy key files from a specified wallet directory.
 *
 * This function retrieves all files with the legacy key extension (e.g., .legacyKey)
 * from the given wallet directory.
 *
 * @param {string} walletName - The name of the wallet directory to search within.
 * @returns {string[]} An array of legacy key filenames without their extensions.
 */
export async function getLegacyKeysFromWallet(
  walletName: string,
): Promise<string[]> {
  return await getFilesWithExtension(
    join(WALLET_DIR, walletName),
    KEY_LEGACY_EXT,
  );
}

/**
 * Fetches all standard wallet files from a specified directory.
 *
 * This function retrieves all wallet files (non-legacy) from the given wallet directory.
 *
 * @param {string} walletName - The name of the wallet directory to search within.
 * @returns {string[]} An array of standard wallet filenames without their extensions.
 */
export async function getWallets(walletName: string): Promise<string[]> {
  return await getFilesWithExtension(join(WALLET_DIR, walletName), WALLET_EXT);
}

/**
 * Fetches all legacy wallet files from a specified directory.
 *
 * This function retrieves all legacy wallet files from the given wallet directory.
 *
 * @param {string} walletName - The name of the wallet directory to search within.
 * @returns {string[]} An array of legacy wallet filenames without their extensions.
 */
export async function getLegacyWallets(walletName: string): Promise<string[]> {
  return await getFilesWithExtension(
    join(WALLET_DIR, walletName),
    WALLET_LEGACY_EXT,
  );
}

/**
 * Fetches all wallet filenames (both standard and legacy) from the main wallet directory, including their extensions.
 *
 * This function retrieves all wallet filenames, both standard and legacy, from each wallet subdirectory
 * within the main wallet directory. The filenames returned will include their respective extensions.
 *
 * @returns {string[]} An array of all wallet filenames with their extensions.
 */
export async function getAllWallets(): Promise<string[]> {
  await ensureWalletExists();

  const walletDirs = await services.filesystem.readDir(WALLET_DIR);

  let wallets: string[] = [];

  for (const dirName of walletDirs) {
    if (
      !(await services.filesystem.directoryExists(join(WALLET_DIR, dirName)))
    ) {
      continue;
    }

    wallets = wallets.concat(
      await getFilesWithExtension(join(WALLET_DIR, dirName), WALLET_LEGACY_EXT),
    );

    wallets = wallets.concat(
      await getFilesWithExtension(join(WALLET_DIR, dirName), WALLET_EXT),
    );
  }

  return wallets;
}

export async function getAllPlainKeys(): Promise<string[]> {
  return await getFilesWithExtension(PLAIN_KEY_DIR, KEY_EXT);
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

/**
 * Parses the input string to determine if it represents a single number or a range of numbers.
 * The function can handle ranges separated by either a hyphen '-' or a comma ','.
 *
 * @param {string} input - The input string to be parsed. The format can be a single number (e.g., "5")
 *                         or a range (e.g., "1-10" or "1,10").
 * @returns {number | [number, number]} - If the input is a single number, returns the number.
 *                                        If the input is a range, returns a tuple of two numbers
 *                                        representing the start and end of the range.
 * @throws {Error} - Throws an error if the input format is not valid, either for a single number or a range.
 */
export function parseKeyIndexOrRange(input: string): number | [number, number] {
  const trimmedInput = input.trim();
  const hasHyphen = trimmedInput.includes('-');
  const hasComma = trimmedInput.includes(',');
  const hasInvalidInput = /[^0-9,\- ]/.test(trimmedInput);

  if (hasInvalidInput) {
    throw new Error('Invalid number input. e.g "1" or "1-10" or "1,10"');
  }

  const rangeSeparator = hasHyphen ? '-' : hasComma ? ',' : undefined;

  if (rangeSeparator) {
    const parts = trimmedInput
      .split(rangeSeparator)
      .map((part) => parseInt(part, 10));
    if (parts.length === 2 && parts.every(Number.isInteger)) {
      return [parts[0], parts[1]];
    } else {
      throw new Error(
        'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
      );
    }
  } else {
    const number = parseInt(trimmedInput, 10);
    if (!Number.isInteger(number)) {
      throw new Error('Invalid number format. e.g "1"');
    }
    return number;
  }
}

/**
 * Extracts the start index from the output of parseKeyIndexOrRange.
 *
 * @param {number | [number, number]} rangeOrNumber - The result from parseKeyIndexOrRange, can be a single number or a range tuple.
 * @returns {number} - The start index
 * @throws {TypeError} - Throws if the input is not a number or a valid range tuple.
 */
export function extractStartIndex(
  rangeOrNumber: number | [number, number],
): number {
  if (typeof rangeOrNumber === 'number') {
    return rangeOrNumber;
  } else if (
    Array.isArray(rangeOrNumber) &&
    rangeOrNumber.length === 2 &&
    rangeOrNumber.every((elem) => typeof elem === 'number')
  ) {
    return rangeOrNumber[0];
  } else {
    throw new TypeError(
      'Invalid input: Input must be a number or a range tuple of two numbers.',
    );
  }
}
