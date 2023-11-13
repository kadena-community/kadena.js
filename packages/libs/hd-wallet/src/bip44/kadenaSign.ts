import type { IUnsignedCommand } from '@kadena/client';
import { verifySig } from '@kadena/cryptography-utils';
import type { EncryptedString } from '../utils/kadenaEncryption';
import { kadenaDecrypt } from '../utils/kadenaEncryption';
import { signWithKeyPair, signWithSeed } from './utils/sign';

/**
 * Signs a Kadena transaction with a given public and private key pair.
 *
 * @param {string} publicKey - The public key to be used for signing the transaction.
 * @param {string} encryptedPrivateKey - The private key to be used for signing the transaction.
 * @returns {Function} A function that takes an unsigned command (`IUnsignedCommand`) and returns an object with an array of signatures.
 */
export function kadenaSignWithKeyPair(
  password: string,
  publicKey: string,
  encryptedPrivateKey: EncryptedString,
): (tx: IUnsignedCommand) => { sigs: { sig: string }[] } {
  return signWithKeyPair(
    publicKey,
    Buffer.from(kadenaDecrypt(password, encryptedPrivateKey)).toString('hex'),
  );
}

/**
 * Signs a Kadena transaction with a seed and index.
 *
 * @param {Uint8Array} seed - The seed array used to derive key pairs for signing.
 * @param {number} index - The index number used to select the correct key pair from the derived set.
 * @returns {Function} A function that takes an unsigned command (`IUnsignedCommand`) and returns an object with an array of signatures.
 */
export function kadenaSignWithSeed(
  password: string,
  seed: EncryptedString,
  index: number,
  derivationPathTemplate: string = `m'/44'/626'/<index>'/0'/0'`,
): (tx: IUnsignedCommand) => { sigs: { sig: string }[] } {
  return signWithSeed(
    kadenaDecrypt(password, seed),
    derivationPathTemplate.replace('<index>', index.toString()),
  );
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
