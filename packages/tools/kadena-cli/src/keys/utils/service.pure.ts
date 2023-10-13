import type { IPactCommand, IUnsignedCommand } from '@kadena/client';
import { sign as cryptoSign } from '@kadena/cryptography-utils';

import { base64ToBuffer, bufferToBase64, decrypt, encrypt } from './encrypt.js';
import { deriveKeyPair } from './sign.js';

import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { randomBytes } from 'ed25519-keygen/utils';

/**
 * Convert a given mnemonic phrase into a seed buffer.
 *
 * @param {string} mnemonic - A mnemonic seed phrase to be converted into a seed buffer.
 * @param {string} [password] - Optional password for encrypting the seed.
 * @throws {Error} Throws an error if the provided mnemonic is not valid.
 * @returns {Promise<{ seedBuffer: Uint8Array, seed: string }>} - Returns the seed buffer and processed seed.
 */
export async function setSeedFromMnemonic(
  mnemonic: string,
  password?: string,
): Promise<{ seedBuffer: Uint8Array; seed: string }> {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
    throw Error('Invalid mnemonic.');
  }

  const seedBuffer = await bip39.mnemonicToSeed(mnemonic);
  const seed = processSeedForStorage(seedBuffer, password);
  return {
    seedBuffer,
    seed,
  };
}

/**
 * Generates a seed based on a mnemonic phrase. The seed can be either encrypted or not,
 * based on whether a password is provided.
 *
 * @param {string} [password] - Optional password for encrypting the seed. If not provided, the seed remains unencrypted.
 * @returns {Promise<{ words: string, seed: string }>} An object containing the mnemonic words and the stored seed.
 * @throws Will throw an error if mnemonic generation or validation fails, or if seed buffering fails.
 */
export async function generateSeed(
  password?: string,
): Promise<{ words: string; seed: string }> {
  const words = bip39.generateMnemonic(wordlist); // Assuming wordlist is globally defined or you can pass it as parameter if needed
  if (!bip39.validateMnemonic(words, wordlist)) {
    throw Error('Invalid mnemonic.');
  }
  const seedBuffer = await bip39.mnemonicToSeed(words);
  const seed = processSeedForStorage(seedBuffer, password);
  return {
    words,
    seed,
  };
}

/**
 * Function to get the public key at a specific index.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer used for key generation.
 * @param {number} index - The index of the public key to retrieve.
 * @returns {string} The public key.
 */
export function getPublicKeyAtIndex(
  seedBuffer: Uint8Array,
  index: number,
): string {
  return deriveKeyPair(seedBuffer, index).publicKey;
}

/**
 * Function to restore a wallet using a stored seed.
 *
 * @param {string} storedSeed - The stored seed string, which may be encrypted.
 * @param {string} password - The password for decrypting the seed.
 * @param {number} keyLength - The number of public keys to generate.
 * @returns {string[]} An array of public keys.
 */
export function restoreWallet(
  storedSeed: string,
  password: string,
  keyLength: number,
): string[] {
  try {
    const seedBuffer = processStoredSeed(storedSeed, password);
    if (seedBuffer === undefined) {
      throw Error('Failed to set _seedBuffer.');
    }
    return _generateKeys(seedBuffer, keyLength);
  } catch (error) {
    console.error(error);
    return [];
  }
}

/**
 * Function to generate a public key based on the provided seed buffer and public keys.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer used for key generation.
 * @param {string[]} publicKeys - An array of existing public keys.
 * @returns {string} The generated public key.
 */
export function generatePublicKey(
  seedBuffer: Uint8Array,
  publicKeys: string[],
): string {
  const pair = deriveKeyPair(seedBuffer, publicKeys.length);
  return pair.publicKey;
}

/**
 * Generates a single key pair based on the provided seed buffer and the current number of public keys.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number} currentPublicKeyCount - The current number of public keys (to determine the next index).
 * @returns {{ publicKey: string; secretKey: string }} The generated key pair.
 * @throws {Error} Throws an error if the seed buffer is not provided.
 */
export function generateKeyPair(
  seedBuffer: Uint8Array,
  currentPublicKeyCount: number,
): { publicKey: string; secretKey: string } {
  if (seedBuffer === undefined) throw Error('No seed provided.');

  const pair = deriveKeyPair(seedBuffer, currentPublicKeyCount);

  return {
    publicKey: pair.publicKey,
    secretKey: pair.privateKey,
  };
}

/**
 * Generates multiple key pairs based on the provided seed buffer.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number} [count=1] - The number of key pairs to generate.
 * @returns {{ publicKey: string; secretKey: string }[]} An array of generated key pairs.
 * @throws {Error} Throws an error if the seed buffer is not provided.
 */
export function generateKeyPairsFromSeed(
  seedBuffer: Uint8Array,
  count: number = 1,
): { publicKey: string; secretKey: string }[] {
  if (seedBuffer === undefined) throw Error('No seed provided.');

  const keyPairs: { publicKey: string; secretKey: string }[] = [];

  for (let i = 0; i < count; i++) {
    const pair = deriveKeyPair(seedBuffer, i);
    keyPairs.push({
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    });
  }

  return keyPairs;
}

/**
 * Generates random key pairs without updating the internal state.
 *
 * @param {number} [count=1] - The number of key pairs to generate.
 * @returns {{ publicKey: string; secretKey: string }[]} An array of generated key pairs.
 */
export function generateKeyPairsFromRandom(
  count: number = 1,
): { publicKey: string; secretKey: string }[] {
  const keyPairs: { publicKey: string; secretKey: string }[] = [];
  for (let i = 0; i < count; i++) {
    const randomSeedBuffer = randomBytes(32);
    const pair = deriveKeyPair(randomSeedBuffer, keyPairs.length + i);

    keyPairs.push({
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    });
  }

  return keyPairs;
}

/**
 * Signs a given message using the specified public key.
 *
 * @param {string} msg - The message to be signed.
 * @param {string} publicKey - The public key to use for signing.
 * @param {string[]} publicKeys - An array of public keys to search in.
 * @param {Uint8Array} seedBuffer - The seed buffer to derive keys from.
 * @returns {ReturnType<typeof cryptoSign>} The signature result.
 * @throws {Error} Throws an error if the seed is not set, the public key is not found, or there's a public key mismatch.
 */
export function sign(
  msg: string,
  publicKey: string,
  publicKeys: string[],
  seedBuffer: Uint8Array,
): ReturnType<typeof cryptoSign> {
  if (seedBuffer === undefined) throw Error('No seed set.');

  const index = getPublicKeyIndex(publicKey, publicKeys);
  const pair = deriveKeyPair(seedBuffer, index);

  if (pair.publicKey !== publicKey) {
    throw Error('Public key mismatch.');
  }

  return cryptoSign(msg, {
    secretKey: pair.privateKey,
    publicKey: pair.publicKey,
  });
}

/**
 * Signs a given transaction using a custom signing function.
 *
 * @param {IUnsignedCommand} tx - The unsigned transaction command.
 * @param {string[]} publicKeys - An array of public keys to check against.
 * @param {Uint8Array} seedBuffer - The seed buffer to derive keys from.
 * @param {typeof sign} signFunction - A custom signing function that takes message, public key, public keys array, and seed buffer as arguments.
 * @returns {IUnsignedCommand} The signed transaction command.
 */
export function signTransaction(
  tx: IUnsignedCommand,
  publicKeys: string[],
  seedBuffer: Uint8Array,
  signFunction: typeof sign,
): IUnsignedCommand {
  const command: IPactCommand = JSON.parse(tx.cmd);
  const sigs = command.signers.map((signer) => {
    if (!publicKeys.includes(signer.pubKey)) {
      return undefined;
    }
    const { sig } = signFunction(tx.cmd, signer.pubKey, publicKeys, seedBuffer);
    if (sig === undefined) return undefined;
    return { sig, pubKey: signer.pubKey };
  });

  return { ...tx, sigs: sigs };
}

/**
 * Gets the index of a public key in the given array of public keys.
 *
 * @param {string} publicKey - The public key to search for.
 * @param {string[]} publicKeys - An array of public keys to search in.
 * @returns {number} The index of the public key in the array.
 * @throws {Error} Throws an error if the public key is not found.
 */
function getPublicKeyIndex(publicKey: string, publicKeys: string[]): number {
  const index = publicKeys.indexOf(publicKey);
  if (index === -1) {
    throw Error(`No public key found. (${publicKey})`);
  }
  return index;
}

/**
 * Helper function to generate an array of public keys based on the provided seed buffer and length.
 *
 * @param {Uint8Array} seedBuffer - The seed buffer to use for key generation.
 * @param {number} length - The number of public keys to generate.
 * @returns {string[]} An array of generated public keys.
 */
function _generateKeys(seedBuffer: Uint8Array, length: number): string[] {
  const publicKeys = [];
  for (let i = 0; i < length; i++) {
    const pair = deriveKeyPair(seedBuffer, i);
    publicKeys.push(pair.publicKey);
  }
  return publicKeys;
}

/**
 * Abstracts the process of either encrypting the seed buffer or converting it to Base64 based on a provided password.
 *
 * @param {Uint8Array} seedBuffer - Seed buffer to be encrypted or converted.
 * @param {string} [password] - Optional password for encrypting the seed buffer.
 * @returns {string} - Returns either the encrypted seed string or the Base64 encoded seed string.
 */
function processSeedForStorage(
  seedBuffer: Uint8Array,
  password?: string,
): string {
  if (password !== undefined) {
    const bufferSeed = Buffer.from(seedBuffer);
    const encrypted = encrypt(bufferSeed, password);
    const cipherText = bufferToBase64(encrypted.cipherText);
    const iv = bufferToBase64(encrypted.iv);
    const tag = bufferToBase64(encrypted.tag); // Convert the authentication tag to Base64
    return `${cipherText}.${iv}.${tag}`;
  } else {
    return bufferToBase64(Buffer.from(seedBuffer));
  }
}

/**
 * Processes a stored seed string to obtain a Uint8Array seed buffer.
 *
 * @param {string} storedSeed - The stored seed string, which may be encrypted or in Base64 format.
 * @param {string} [password] - Optional password for decrypting the seed string if encrypted.
 * @throws {Error} Throws an error if the stored seed is not provided, or if decryption fails.
 * @returns {Uint8Array} The seed buffer obtained from the stored seed.
 */
export function processStoredSeed(
  storedSeed: string,
  password?: string,
): Uint8Array {
  if (!storedSeed) throw Error('No seed provided.');

  if (password !== undefined) {
    const [cipherTextBase64, ivBase64, tagBase64] = storedSeed.split('.'); // Split into three parts
    const decrypted = decrypt(
      {
        cipherText: base64ToBuffer(cipherTextBase64),
        iv: base64ToBuffer(ivBase64),
        tag: base64ToBuffer(tagBase64), // Convert the tag from Base64 to buffer
      },
      password,
    );
    if (!decrypted) {
      throw Error('Failed to decrypt seed.');
    }
    return Uint8Array.from(decrypted);
  } else {
    return Uint8Array.from(base64ToBuffer(storedSeed));
  }
}
