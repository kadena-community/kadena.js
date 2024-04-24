import type { ChainId } from '@kadena/types';
import { load } from 'js-yaml';
import path from 'path';
import sanitize from 'sanitize-filename';
import type { ZodError } from 'zod';
import { MAX_CHAIN_IDS, MAX_CHARACTERS_LENGTH } from '../constants/config.js';

/**
 * Assigns a value to an object's property if the value is neither undefined nor an empty string.
 * This function provides a type-safe way to conditionally update properties on an object.
 *
 * @template T - The type of the object to which the value might be assigned.
 * @template K - The type of the property key on the object.
 * @param {T} obj - The target object to which the value might be assigned.
 * @param {K} key - The property key on the object where the value might be assigned.
 * @param {T[K] | undefined} value - The value to be potentially assigned. If undefined or empty string, no assignment occurs.
 */
export function safeAssign<T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | undefined,
): void {
  if (value !== undefined && value !== '') {
    obj[key] = value;
  }
}

/**
 * Merges properties from the source object into the target object,
 * overwriting properties on the target only if they are defined in the source.
 *
 * @template T - The type of the target object and the source object.
 * @param {T} target - The target object that will receive properties from the source.
 * @param {Partial<T>} source - The source object from which properties will be taken.
 * @returns {T} - The merged object.
 */
export function mergeConfigs<T extends object>(
  target: T,
  source: Partial<T>,
): T {
  for (const key in source) {
    if (key in target) {
      safeAssign(target, key as keyof T, source[key]);
    }
  }
  return target;
}

/**
 * Sanitizes a string to create a safe filename by replacing illegal, control,
 * reserved and trailing characters with hyphens. It ensures that the file does
 * not end with a hyphen.
 *
 * @param {string} str - The input string that needs to be sanitized.
 * @returns {string} - The sanitized string, ensuring it does not end with a hyphen.
 *
 * @example
 * const originalString = "This is a <sample> string:file\\name?";
 * const sanitizedString = sanitizeFilename(originalString);
 * console.log(sanitizedString); // Outputs: This-is-a--sample--string-file-name
 */
export function sanitizeFilename(str: string): string {
  return sanitize(str);
}

/**
 * Checks if the input string contains only alphabetic characters.
 *
 * @function
 * @export
 * @param {string} str - The input string to be checked.
 * @returns {boolean} Returns true if the string only contains alphabetic characters (either lower case or upper case), and false if the string contains any non-alphabetic characters.
 *
 * @example
 *
 * isAlphabetic("HelloWorld"); // returns true
 * isAlphabetic("123ABC"); // returns false
 * isAlphabetic("Hello World!"); // returns false
 */
export function isAlphabetic(str: string): boolean {
  const regex = /^[A-Za-z]+$/;
  return regex.test(str);
}

/**
 * Checks if a string contains only characters valid in filenames
 *
 * @param {string} str - The input string that needs to be checked.
 * @returns {boolean} - Returns `true` if the string is valid
 *
 * @example
 * const isValid = isValidFilename("abc-123"); // Outputs: true
 */
export function isValidFilename(str: string): boolean {
  str = str.trim();
  if (str.length === 0) return false;

  // Based on https://superuser.com/a/358861
  const regex = /[\\\/:*?"<>|]/;

  return !regex.test(str);
}

/**
 * Checks if a string contains only numeric characters.
 *
 * @param {string} str - The input string that needs to be checked.
 * @returns {boolean} - Returns `true` if the string is numeric, otherwise returns `false`.
 *
 * @example
 * const isNum = isNumeric("12345"); // Outputs: true
 */
export function isNumeric(str: string): boolean {
  const regex = /^[0-9]+$/;
  return regex.test(str);
}

// export const skipSymbol = Symbol('skip');
// export const createSymbol = Symbol('createSymbol');

export const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => value !== null && value !== undefined;

export const truncateText = (
  str: string,
  maxLength: number = MAX_CHARACTERS_LENGTH,
): string =>
  str.length > maxLength ? `${str.substring(0, maxLength - 3)}...` : str;

export const maskStringPreservingStartAndEnd = (
  str: string,
  maxLength = 15,
  maskChar = '.',
  maskCharLength = 4,
): string => {
  if (str.length <= maxLength) {
    return str;
  } else {
    const startChars = str.substring(0, (maxLength - maskCharLength) / 2);
    const endChars = str.substring(
      str.length - (maxLength - maskCharLength) / 2,
    );
    return `${startChars}${maskChar.repeat(maskCharLength)}${endChars}`;
  }
};

export const isNotEmptyString = (value: unknown): value is string =>
  value !== null && value !== undefined && value !== '';

export const isNotEmptyObject = <T extends object>(obj?: T | null): obj is T =>
  obj !== undefined && obj !== null && Object.keys(obj).length > 0;

/**
 * Prints zod error issues in format
 * ```code
 * {key}: [issues by key]\n
 * ...repeat
 * ```
 */
export const formatZodError = (error: ZodError): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const format = error.format() as any;
  const formatted = Object.keys(format)
    .map((key) => {
      if (key === '_errors') return null;
      return `${key}: ${format[key]?._errors.join(', ')}`;
    })
    .filter(notEmpty);
  return formatted.join('\n');
};

export const safeJsonParse = <T extends unknown>(value: string): T | null => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export const safeYamlParse = <T extends unknown>(value: string): T | null => {
  try {
    return load(value) as T;
  } catch (e) {
    return null;
  }
};

export function detectFileParseType(filepath: string): 'yaml' | 'json' | null {
  const ext = path.extname(filepath);
  if (ext === '.yaml' || ext === '.yml') {
    return 'yaml';
  }
  if (ext === '.json') {
    return 'json';
  }
  return null;
}

export function detectArrayFileParseType(
  filepaths: string[],
): { filepath: string; type: 'yaml' | 'json' }[] {
  return filepaths.reduce(
    (memo, filepath) => {
      const type = detectFileParseType(filepath);
      if (type) memo.push({ filepath, type });
      return memo;
    },
    [] as { filepath: string; type: 'yaml' | 'json' }[],
  );
}

export function getFileParser(
  type: 'yaml' | 'json',
): <T extends unknown>(value: string) => T | null {
  return type === 'yaml' ? safeYamlParse : safeJsonParse;
}

export const generateAllChainIds = (): ChainId[] =>
  Array.from(
    { length: MAX_CHAIN_IDS },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    (_, index) => index.toString() as ChainId,
  );

/**
 * Extracts the public key from a given account string.
 *
 * @param {string} account - The account string in the format `[kctwu]:[a-zA-Z0-9]{64}`.
 *
 * @returns {string} - The extracted public key from the account.
 *
 * @throws {Error} - Throws an error if the account format is invalid.
 *
 * @example
 * const account = 'k:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
 * const pubKey = getPubKeyFromAccount(account);
 * console.log(pubKey); // Outputs: abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01
 */
export function getPubKeyFromAccount(account: string): string {
  if (!account.toLowerCase().match(/^[kctwu]:[a-zA-Z0-9]{64}$/)) {
    throw new Error('Invalid account');
  }

  const pubKey = account.toLowerCase().slice(2);
  return pubKey;
}
