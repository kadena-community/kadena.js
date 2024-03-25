import type { EncryptedString } from '@kadena/hd-wallet';
import type { IKeyPair } from './storage.js';

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
