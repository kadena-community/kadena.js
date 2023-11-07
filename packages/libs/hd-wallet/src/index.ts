export * from './utils';
import type { IUnsignedCommand } from '@kadena/client';
import { verifySig } from '@kadena/cryptography-utils';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
  decryptPrivateKey,
  encryptOrEncodeSeed,
  encryptPrivateKey,
  extractSeedBuffer,
} from './utils/encrypt';
import { deriveKeyPair, signWithKeyPair, signWithSeed } from './utils/sign';

/**
 * Changes the password of an encrypted private key.
 *
 * @param {string} privateKey - The encrypted private key as a Base64 encoded string.
 * @param {string} oldPassword - The current password used to encrypt the private key.
 * @param {string} newPassword - The new password to encrypt the private key with.
 * @returns {string} - The newly encrypted private key as a Base64 encoded string.
 * @throws {Error} - Throws an error if the old password is empty, new password is incorrect empty passwords are empty, or if encryption with the new password fails.
 */
export function kadenaChangePassword(
  privateKey: string,
  oldPassword: string,
  newPassword: string,
): string {
  if (oldPassword === '' || oldPassword === undefined) {
    throw new Error('The old password cannot be empty.');
  }
  if (newPassword === '' || newPassword === undefined) {
    throw new Error('The new password cannot be empty.');
  }
  if (oldPassword === newPassword) {
    throw new Error(
      'The new password must be different from the old password.',
    );
  }

  let decryptedPrivateKey;
  try {
    decryptedPrivateKey = decryptPrivateKey(privateKey, oldPassword);
  } catch (error) {
    throw new Error(
      `Failed to decrypt the private key with the old password: ${error.message}`,
    );
  }

  let newEncryptedPrivateKey;
  try {
    newEncryptedPrivateKey = encryptPrivateKey(
      decryptedPrivateKey,
      newPassword,
    );
  } catch (error) {
    throw new Error(
      `Failed to encrypt the private key with the new password: ${error.message}`,
    );
  }

  return newEncryptedPrivateKey;
}

/**
 * Convert a given mnemonic phrase into a seed buffer.
 *
 * @param {string} mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
 * @param {string} [password] - Optional password for encrypting the seed.
 * @throws {Error} Throws an error if the provided mnemonic is not valid.
 * @returns {Promise<{ seedBuffer: Uint8Array, seed: string }>} - Returns the seed buffer and processed seed.
 */
export async function kadenaGenSeedFromMnemonic(
  mnemonic: string,
  password?: string,
): Promise<{ seedBuffer: Uint8Array; seed: string }> {
  if (bip39.validateMnemonic(mnemonic, wordlist) === false) {
    throw Error('Invalid mnemonic.');
  }

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
  let seed: string;

  if (typeof password === 'string' && password.length > 0) {
    seed = encryptOrEncodeSeed(seedBuffer, password);
  } else {
    seed = encryptOrEncodeSeed(seedBuffer);
  }
  return {
    seedBuffer,
    seed,
  };
}

/**
 * Generates a mnemonic phrase using the BIP39 protocol with a specified wordlist.
 *
 * @returns {string} A valid BIP39 mnemonic phrase.
 * @throws {Error} If the generated mnemonic is invalid.
 */
export function kadenaGenMnemonic(): string {
  const words = bip39.generateMnemonic(wordlist);
  if (bip39.validateMnemonic(words, wordlist) === false) {
    throw Error('Invalid mnemonic.');
  }
  return words;
}

/**
 * Generates a key pair from a seed buffer and an index or range of indices, and optionally encrypts the private key.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number | [number, number]} indexOrRange - Either a single index or a tuple with start and end indices for key pair generation.
 * @param {string} [password] - Optional password for encrypting the private key.
 * @returns {([string, string] | [string, string][])} - Depending on the input, either a tuple for a single key pair or an array of tuples for a range of key pairs, with the private key encrypted if a password is provided.
 * @throws {Error} Throws an error if the seed buffer is not provided, if the indices are invalid, or if encryption fails.
 */
export function kadenaGenKeypair(
  seedBuffer: Uint8Array,
  indexOrRange: number | [number, number],
  password?: string,
): [string, string] | [string, string][] {
  if (seedBuffer === undefined) throw new Error('No seed provided.');

  if (Array.isArray(indexOrRange)) {
    const [start, end] = indexOrRange;
    if (start > end)
      throw new Error(
        'Invalid range: start index must be less than or equal to end index.',
      );

    const keyPairs: [string, string][] = [];
    for (let i = start; i <= end; i++) {
      const { publicKey, privateKey } = deriveKeyPair(seedBuffer, i);
      const privatekeyToUse =
        password !== undefined
          ? encryptPrivateKey(Buffer.from(privateKey, 'hex'), password)
          : privateKey;
      keyPairs.push([publicKey, privatekeyToUse]);
    }
    return keyPairs;
  } else {
    const { publicKey, privateKey } = deriveKeyPair(seedBuffer, indexOrRange);

    const privatekeyToUse =
      password !== undefined
        ? encryptPrivateKey(Buffer.from(privateKey, 'hex'), password)
        : privateKey;
    return [publicKey, privatekeyToUse];
  }
}

/**
 * Decrypts an encrypted private key using the provided password.
 * This function is a wrapper for the internal decryption logic, intended
 * for public-facing API usage where the private key encryption follows
 *
 * @param {string} encryptedPrivateKey - The encrypted private key as a Base64 encoded string.
 * @param {string} password - The password used to encrypt the private key.
 * @returns {Uint8Array} The decrypted private key.
 * @throws {Error} Throws an error if decryption fails.
 */
export function kadenaDecryptPrivateKey(
  encryptedPrivateKey: string,
  password: string,
): Uint8Array {
  try {
    return decryptPrivateKey(encryptedPrivateKey, password);
  } catch (error) {
    console.error('Failed to decrypt the private key:', error);
    throw new Error(
      'Decryption failed. The provided password may be incorrect, or the encrypted key is corrupted.',
    );
  }
}

/**
 * Generates a public key from a seed buffer and an index.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer used for key generation.
 * @param {number} [index] - The optional index of the public key to retrieve, defaults to 0.
 * @returns {string} - The public key in hexadecimal string format.
 * @throws {Error} Throws an error if the seed buffer is not provided or if the index is invalid.
 */
export function kadenaGetPublic(
  seedBuffer: Uint8Array,
  index: number = 0,
): string {
  const keyPair = deriveKeyPair(seedBuffer, index);
  return keyPair.publicKey;
}

/**
 *  Restores buffer from seed string, potentially decrypting it if a password is provided.
 *
 * @param {string} seed - The seed string, which may be encrypted.
 * @param {string} password - The password for decrypting the seed.
 * @returns {Uint8Array} The restored seed buffer to use for key generation
 */
export function kadenaRestoreSeedBufferFromSeed(
  seed: string,
  password?: string,
): Uint8Array {
  if (typeof password !== 'undefined') {
    return extractSeedBuffer(seed, password);
  } else {
    return extractSeedBuffer(seed);
  }
}

/**
 * Signs a Kadena transaction with a given public and private key pair.
 *
 * @param {string} publicKey - The public key to be used for signing the transaction.
 * @param {string} privateKey - The private key to be used for signing the transaction.
 * @returns {Function} A function that takes an unsigned command (`IUnsignedCommand`) and returns an object with an array of signatures.
 */
export function kadenaSignWithKeyPair(
  publicKey: string,
  privateKey: string,
): (tx: IUnsignedCommand) => { sigs: { sig: string }[] } {
  return signWithKeyPair(publicKey, privateKey);
}

/**
 * Signs a Kadena transaction with a seed and index.
 *
 * @param {Uint8Array} seed - The seed array used to derive key pairs for signing.
 * @param {number} index - The index number used to select the correct key pair from the derived set.
 * @returns {Function} A function that takes an unsigned command (`IUnsignedCommand`) and returns an object with an array of signatures.
 */
export function kadenaSignWithSeed(
  seed: Uint8Array,
  index: number,
): (tx: IUnsignedCommand) => { sigs: { sig: string }[] } {
  return signWithSeed(seed, index);
}

/**
 * Verifies the signature for a message against a given public key using the Kadena signature verification convention.
 *
 * @param {string} message - The message in string format to be verified.
 * @param {string} publicKey - The public key in hexadecimal string format to verify the signature against.
 * @param {string} signature - The signature in hexadecimal string format to be verified.
 * @returns {boolean} - Returns true if verification succeeded or false if it failed.
 */
export function kadenaVerify(
  message: string,
  publicKey: string,
  signature: string,
): boolean {
  // Convert the message, public key, and signature from hex string to Uint8Array
  const msgUint8Array = Uint8Array.from(Buffer.from(message, 'hex'));
  const publicKeyUint8Array = Uint8Array.from(Buffer.from(publicKey, 'hex'));
  const signatureUint8Array = Uint8Array.from(Buffer.from(signature, 'hex'));

  return verifySig(msgUint8Array, signatureUint8Array, publicKeyUint8Array);
}
