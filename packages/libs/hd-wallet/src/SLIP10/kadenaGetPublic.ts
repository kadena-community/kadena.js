import type { BinaryLike } from 'crypto';
import { kadenaDecrypt } from '../utils/kadenaEncryption';
import { deriveKeyPair } from './utils/sign';

function genPublicKeyFromSeed(
  seedBuffer: Uint8Array,
  index: number,
  derivationPathTemplate: string,
): string {
  const derivationPath = derivationPathTemplate.replace(
    '<index>',
    index.toString(),
  );

  const { publicKey } = deriveKeyPair(seedBuffer, derivationPath);

  return publicKey;
}

export function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  index: number,
  derivationPathTemplate?: string,
): string;

export function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  indexRange: [number, number],
  derivationPathTemplate?: string,
): string[];

/**
 * Generates a key pair from a seed buffer and an index or range of indices, and optionally encrypts the private key.
 * it uses bip44 m'/44'/626'/${index}' derivation path
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number | [number, number]} indexOrRange - Either a single index or a tuple with start and end indices for key pair generation.
 * @param {string} [password] - Optional password for encrypting the private key.
 * @returns {([string, string] | [string, string][])} - Depending on the input, either a tuple for a single key pair or an array of tuples for a range of key pairs, with the private key encrypted if a password is provided.
 * @throws {Error} Throws an error if the seed buffer is not provided, if the indices are invalid, or if encryption fails.
 */
export function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  indexOrRange: number | [number, number],
  derivationPathTemplate: string = `m'/44'/626'/<index>'`,
): string | string[] {
  if (typeof seed !== 'string' || seed === '') {
    throw new Error('No seed provided.');
  }

  const seedBuffer = kadenaDecrypt(password, seed);

  if (typeof indexOrRange === 'number') {
    return genPublicKeyFromSeed(
      seedBuffer,
      indexOrRange,
      derivationPathTemplate,
    );
  }
  if (Array.isArray(indexOrRange)) {
    const [startIndex, endIndex] = indexOrRange;
    if (startIndex > endIndex) {
      throw new Error('The start index must be less than the end index.');
    }

    const keyPairs: string[] = [];

    for (let index = startIndex; index <= endIndex; index++) {
      const publicKey = genPublicKeyFromSeed(
        seedBuffer,
        index,
        derivationPathTemplate,
      );

      keyPairs.push(publicKey);
    }

    return keyPairs;
  }
  throw new Error('Invalid index or range.');
}
