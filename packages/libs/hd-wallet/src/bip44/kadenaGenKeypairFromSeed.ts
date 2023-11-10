import { kadenaDecrypt, kadenaEncrypt } from '../utils/kadenaEncryption';
import { deriveKeyPair } from './utils/sign';

function genKeypairFromSeed(
  password: string,
  seedBuffer: Uint8Array,
  index: number,
  derivationPathTemplate: string,
): [string, string] {
  const derivationPath = derivationPathTemplate.replace(
    '<index>',
    index.toString(),
  );

  const { publicKey, privateKey } = deriveKeyPair(seedBuffer, derivationPath);

  const encryptedPrivateKey = kadenaEncrypt(
    Buffer.from(privateKey, 'hex'),
    password,
  );

  return [publicKey, encryptedPrivateKey];
}

export function kadenaGenKeypairFromSeed(
  password: string,
  seed: string,
  index: number,
  derivationPathTemplate?: string,
): [string, string];

export function kadenaGenKeypairFromSeed(
  password: string,
  seed: string,
  indexRange: [number, number],
  derivationPathTemplate?: string,
): Array<[string, string]>;

/**
 * Generates a key pair from a seed buffer and an index or range of indices, and optionally encrypts the private key.
 * it uses bip44 m'/44'/626'/${index}'/0'/0' derivation path
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number | [number, number]} indexOrRange - Either a single index or a tuple with start and end indices for key pair generation.
 * @param {string} [password] - Optional password for encrypting the private key.
 * @returns {([string, string] | [string, string][])} - Depending on the input, either a tuple for a single key pair or an array of tuples for a range of key pairs, with the private key encrypted if a password is provided.
 * @throws {Error} Throws an error if the seed buffer is not provided, if the indices are invalid, or if encryption fails.
 */
export function kadenaGenKeypairFromSeed(
  password: string,
  seed: string,
  indexOrRange: number | [number, number],
  derivationPathTemplate: string = `m'/44'/626'/<index>'/0'/0'`,
): [string, string] | Array<[string, string]> {
  if (typeof seed !== 'string' || seed === '') {
    throw new Error('No seed provided.');
  }

  const seedBuffer = kadenaDecrypt(seed, password);

  if (typeof indexOrRange === 'number') {
    return genKeypairFromSeed(
      password,
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

    const keyPairs: [string, string][] = [];

    for (let index = startIndex; index <= endIndex; index++) {
      const [publicKey, encryptedPrivateKey] = genKeypairFromSeed(
        password,
        seedBuffer,
        index,
        derivationPathTemplate,
      );

      keyPairs.push([publicKey, encryptedPrivateKey]);
    }

    return keyPairs;
  }
  throw new Error('Invalid index or range.');
}
