import type { BinaryLike } from '../utils/crypto.js';
import { kadenaDecrypt } from '../utils/kadenaEncryption.js';
import { isDerivationPathTemplateValid } from './utils/isDerivationPathTemplateValid.js';
import { deriveKeyPair } from './utils/sign.js';

function genPublicKeyFromSeed(
  seedBuffer: Uint8Array,
  index: number,
  derivationPathTemplate: string,
): string {
  if (!isDerivationPathTemplateValid(derivationPathTemplate)) {
    throw new Error('Invalid derivation path template.');
  }

  const derivationPath = derivationPathTemplate.replace(
    '<index>',
    index.toString(),
  );

  const { publicKey } = deriveKeyPair(seedBuffer, derivationPath);

  return publicKey;
}

/**
 *
 * @param password - password for decrypting the seed
 * @param seed - encrypted seed to generate keypair
 * @param index - index to generate public key
 * @param derivationPathTemplate - derivation path template
 * @public
 */
export function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  index: number,
  derivationPathTemplate?: string,
): Promise<string>;

/**
 *
 * @param password - password for decrypting the seed
 * @param seed - encrypted seed to generate keypair
 * @param indexRange - range of indices to generate public keys
 * @param derivationPathTemplate - derivation path template
 * @public
 */
export function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  indexRange: [number, number],
  derivationPathTemplate?: string,
): Promise<string[]>;

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
export async function kadenaGetPublic(
  password: BinaryLike,
  seed: BinaryLike,
  indexOrRange: number | [number, number],
  derivationPathTemplate: string = `m'/44'/626'/<index>'`,
): Promise<string | string[]> {
  if (seed === undefined || seed === '') {
    throw new Error('NO_SEED: No seed provided.');
  }

  const seedBuffer = new Uint8Array(await kadenaDecrypt(password, seed));

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
