import type { BinaryLike } from '../utils/crypto.js';
import type { EncryptedString } from '../utils/kadenaEncryption.js';
import { kadenaDecrypt, kadenaEncrypt } from '../utils/kadenaEncryption.js';
import { isDerivationPathTemplateValid } from './utils/isDerivationPathTemplateValid.js';
import { deriveKeyPair } from './utils/sign.js';

async function genKeypairFromSeed(
  password: BinaryLike,
  seedBuffer: Uint8Array,
  index: number,
  derivationPathTemplate: string,
): Promise<[string, EncryptedString]> {
  if (!isDerivationPathTemplateValid(derivationPathTemplate)) {
    throw new Error('Invalid derivation path template.');
  }
  const derivationPath = derivationPathTemplate.replace(
    '<index>',
    index.toString(),
  );

  const { publicKey, privateKey } = deriveKeyPair(seedBuffer, derivationPath);

  const encryptedPrivateKey = await kadenaEncrypt(
    password,
    Buffer.from(privateKey, 'hex'),
  );

  return [publicKey, encryptedPrivateKey];
}

/**
 *
 * @param password - password for decrypting the seed
 * @param seed - encrypted seed to generate keypair
 * @param index - index to generate keypair
 * @param derivationPathTemplate - derivation path template
 * @public
 */
export function kadenaGenKeypairFromSeed(
  password: BinaryLike,
  seed: EncryptedString,
  index: number,
  derivationPathTemplate?: string,
): Promise<[string, EncryptedString]>;

/**
 *
 * @param password - password for decrypting the seed
 * @param seed - encrypted seed to generate keypair
 * @param indexRange - range of indices to generate keypair
 * @param derivationPathTemplate - derivation path template
 * @public
 */
export function kadenaGenKeypairFromSeed(
  password: BinaryLike,
  seed: EncryptedString,
  indexRange: [number, number],
  derivationPathTemplate?: string,
): Promise<Array<[string, EncryptedString]>>;

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
export async function kadenaGenKeypairFromSeed(
  password: BinaryLike,
  seed: EncryptedString,
  indexOrRange: number | [number, number],
  derivationPathTemplate: string = `m'/44'/626'/<index>'`,
): Promise<[string, EncryptedString] | Array<[string, EncryptedString]>> {
  if (seed === undefined || seed === '') {
    throw new Error('NO_SEED: No seed provided.');
  }

  if (!isDerivationPathTemplateValid(derivationPathTemplate)) {
    throw new Error('Invalid derivation path template.');
  }

  const seedBuffer = await kadenaDecrypt(password, seed);

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

    const keyPairs: [string, EncryptedString][] = [];

    for (let index = startIndex; index <= endIndex; index++) {
      const [publicKey, encryptedPrivateKey] = await genKeypairFromSeed(
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
