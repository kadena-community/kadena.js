import yaml from 'js-yaml';
import { basename, join } from 'node:path';
import sanitizeFilename from 'sanitize-filename';

import type { EncryptedString } from '@kadena/hd-wallet';
import {
  KEY_EXT,
  KEY_LEGACY_EXT,
  PLAIN_KEY_DIR,
  WALLET_DIR,
  WALLET_EXT,
  WALLET_LEGACY_EXT,
} from '../../constants/config.js';
import { services } from '../../services/index.js';

import { notEmpty } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { IKeyPair } from './storage.js';
import { getFilesWithExtension } from './storage.js';

export interface IWallet {
  folder: string;
  legacy: boolean;
  wallet: string;
  keys: string[];
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
    log.debug(new Error('Invalid wallet file given to getWallet'));
    log.warning(
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
  // eslint-disable-next-line @rushstack/no-new-null
): Promise<string | null> {
  const wallet = await getWallet(walletPath);
  if (!wallet) return null;
  return await services.filesystem.readFile(
    join(WALLET_DIR, wallet.folder, wallet.wallet),
  );
}

export type IPlainKey = IKeyPair & {
  alias: string;
  key: string;
  index: number;
  legacy: boolean;
};

export type IWalletKey = IPlainKey & {
  wallet: IWallet;
};

const readKeyFile = async (path: string): Promise<IPlainKey> => {
  const key = basename(path);
  const file = await services.filesystem.readFile(path);
  const parsed = yaml.load(file ?? '') as {
    publicKey?: string;
    secretKey?: string;
  };

  if (parsed.publicKey === undefined) {
    throw new Error(`Public key not found for key path "${path}"`);
  }

  const index =
    Number(
      (parsed as { index?: string }).index ??
        (key.match(/-([0-9]+)\.key$/)?.[1] as string),
    ) || 0;
  const alias = key; // use to be base name, for now use entire filename
  const legacy = key.endsWith(KEY_LEGACY_EXT);

  return {
    key,
    alias,
    index,
    legacy,
    publicKey: parsed.publicKey,
    secretKey: parsed.secretKey,
  };
};

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
  const plainKey = await readKeyFile(join(WALLET_DIR, wallet.folder, key));
  return {
    ...plainKey,
    wallet,
  };
};

export const getAllPlainKeys = async (): Promise<IPlainKey[]> => {
  const keys = await getAllPlainKeyFiles();
  const result = await Promise.all(
    keys.map((key) => readKeyFile(join(PLAIN_KEY_DIR, key))),
  );
  return result;
};

export const getAllWalletKeys = async (): Promise<IWalletKey[]> => {
  const walletNames = await getAllWallets();
  const wallets = await Promise.all(
    walletNames.map((wallet) => getWallet(wallet)),
  );
  const keys = await Promise.all(
    wallets
      .filter(notEmpty)
      .map((wallet) =>
        Promise.all(wallet.keys.map((key) => getWalletKey(wallet, key))),
      ),
  );
  return keys.flat();
};

export const getAllKeys = async (): Promise<(IPlainKey | IWalletKey)[]> => {
  return (
    await Promise.all([getAllPlainKeys(), await getAllWalletKeys()])
  ).flat();
};

export const isIWalletKey = (
  key: IPlainKey | IWalletKey,
): key is IWalletKey => {
  return (key as IWalletKey).wallet !== undefined;
};

/**
 * Fetches all wallet filenames (both standard and legacy) from the main wallet directory, including their extensions.
 *
 * This function retrieves all wallet filenames, both standard and legacy, from each wallet subdirectory
 * within the main wallet directory. The filenames returned will include their respective extensions.
 *
 * @returns {string[]} An array of all wallet filenames with their extensions.
 */
export async function getAllWallets(): Promise<string[]> {
  if (!(await services.filesystem.directoryExists(WALLET_DIR))) {
    return [];
  }

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

export async function getAllPlainKeyFiles(): Promise<string[]> {
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

/**
 * Parses a string input to extract key pairs in a custom string format.
 *
 * @param {string} input - The string input containing the key pairs in the custom string format.
 * @returns {IKeyPair[]} An array of objects, each containing 'publicKey' and 'secretKey'.
 * @throws {Error} If the input is not in valid custom string format,
 *                 or if required keys ('publicKey' or 'secretKey') are missing.
 */

export function parseKeyPairsInput(input: string): IKeyPair[] {
  return input.split(';').map((pairStr) => {
    const keyValuePairs = pairStr
      .trim()
      .split(',')
      .reduce((acc: Partial<IKeyPair>, keyValue) => {
        const [key, value] = keyValue.split('=').map((item) => item.trim());
        if (key === 'publicKey') {
          acc.publicKey = value;
        } else if (key === 'secretKey') {
          acc.secretKey = value as EncryptedString | string;
        } else if (key === 'index') {
          acc.index = parseInt(value);
        }
        return acc;
      }, {});

    if (
      keyValuePairs.publicKey === undefined ||
      keyValuePairs.secretKey === undefined
    ) {
      throw new Error(
        'Invalid custom string format. Expected "publicKey=xxx,secretKey=xxx;..."',
      );
    }
    return keyValuePairs as IKeyPair;
  });
}
