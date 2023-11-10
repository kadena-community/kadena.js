export * from './utils';
import type { IUnsignedCommand } from '@kadena/client';
import { verifySig } from '@kadena/cryptography-utils';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import {
  deriveKeyPair,
  signWithKeyPair,
  signWithSeed,
} from './bip44/utils/sign';
import { kadenaDecrypt, kadenaEncrypt } from './utils/kadenaEncryption';

export function kadenaGetDerivationPath(index: number): string {
  return `m'/44'/626'/${index}'/0'/0'`;
}

/**
 * Changes the password of an encrypted data.
 *
 * @param {string} privateKey - The encrypted private key as a Base64 encoded string.
 * @param {string} oldPassword - The current password used to encrypt the private key.
 * @param {string} newPassword - The new password to encrypt the private key with.
 * @returns {string} - The newly encrypted private key as a Base64 encoded string.
 * @throws {Error} - Throws an error if the old password is empty, new password is incorrect empty passwords are empty, or if encryption with the new password fails.
 */
export function kadenaChangePassword(
  encryptedData: string,
  oldPassword: string,
  newPassword: string,
): string {
  if (typeof oldPassword !== 'string' || typeof newPassword !== 'string') {
    throw new Error('The old and new passwords must be strings.');
  }
  if (oldPassword === '') {
    throw new Error('The old password cannot be empty.');
  }
  if (newPassword === '') {
    throw new Error('The new password cannot be empty.');
  }
  if (oldPassword === newPassword) {
    throw new Error(
      'The new password must be different from the old password.',
    );
  }

  let decryptedPrivateKey: Uint8Array;
  try {
    decryptedPrivateKey = kadenaDecrypt(encryptedData, oldPassword);
  } catch (error) {
    throw new Error(
      `Failed to decrypt the private key with the old password: ${error.message}`,
    );
  }

  try {
    return kadenaEncrypt(decryptedPrivateKey, newPassword);
  } catch (error) {
    throw new Error(
      `Failed to encrypt the private key with the new password: ${error.message}`,
    );
  }
}

/**
 * Convert a given mnemonic phrase into a seed buffer.
 *
 * @param {string} mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
 * @param {string} [password] - Optional password for encrypting the seed.
 * @throws {Error} Throws an error if the provided mnemonic is not valid.
 * @returns {Promise<{ seedBuffer: Uint8Array, seed: string }>} - Returns the seed buffer and processed seed.
 */
export async function kadenaMnemonicToSeed(
  password: string,
  mnemonic: string,
  // wordList: string[] = wordlist,
): Promise<string> {
  if (bip39.validateMnemonic(mnemonic, wordlist) === false) {
    throw Error('Invalid mnemonic.');
  }

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);

  return kadenaEncrypt(seedBuffer, password);
}

/**
 * Generates a mnemonic phrase using the BIP39 protocol with a specified wordlist.
 *
 * @returns {string} A valid BIP39 mnemonic phrase.
 * @throws {Error} If the generated mnemonic is invalid.
 */
export function kadenaGenMnemonic(): string {
  return bip39.generateMnemonic(wordlist);
}

function genKeypairFromSeed(
  password: string,
  seed: string,
  index: number,
  derivationPathTemplate: string,
): [string, string] {
  if (typeof seed !== 'string' || seed === '') {
    throw new Error('No seed provided.');
  }

  const derivationPath = derivationPathTemplate.replace(
    '<index>',
    index.toString(),
  );

  const seedBuffer = kadenaDecrypt(seed, password);

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

  if (typeof indexOrRange === 'number') {
    return genKeypairFromSeed(
      password,
      seed,
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
        seed,
        index,
        derivationPathTemplate,
      );

      keyPairs.push([publicKey, encryptedPrivateKey]);
    }

    return keyPairs;
  }
  throw new Error('Invalid index or range.');
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
  password: string,
  seed: string,
  derivationPath: string,
): string {
  if (typeof seed !== 'string' || seed === '') {
    throw new Error('No seed provided.');
  }

  const seedBuffer = kadenaDecrypt(seed, password);

  const { publicKey } = deriveKeyPair(seedBuffer, derivationPath);

  return publicKey;
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
