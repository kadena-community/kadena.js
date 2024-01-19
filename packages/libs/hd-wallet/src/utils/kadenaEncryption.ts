import type { BinaryLike } from 'crypto';
import { randomBytes } from 'crypto';
import { decrypt, encrypt } from './crypto.js';

export type EncryptedString = string & { _brand: 'EncryptedString' };

/**
 * Encrypts the message with a password .
 * @param {Uint8Array} message - The message to be encrypted.
 * @param {BinaryLike} password - password used for encryption.
 * @returns {string} The encrypted string
 */
export function kadenaEncrypt<
  TEncode extends 'base64' | 'buffer' = 'base64',
  TReturn = TEncode extends 'base64' ? EncryptedString : Uint8Array,
>(
  password: BinaryLike,
  message: Uint8Array | string,
  encode: TEncode = 'base64' as TEncode,
): TReturn {
  // Using randomBytes for the salt is fine here because the salt is not secret but should be unique.
  const salt = randomBytes(16);
  const { cipherText, iv, tag } = encrypt(Buffer.from(message), password, salt);

  const encrypted = Buffer.from(
    [salt, iv, tag, cipherText].map((x) => x.toString('base64')).join('.'),
  );

  return (
    encode === 'base64'
      ? (encrypted.toString('base64') as EncryptedString)
      : new Uint8Array(encrypted)
  ) as TReturn;
}

/**
 * Decrypts an encrypted message using the provided password.
 * This function is a wrapper for the internal decryption logic, intended
 * for public-facing API usage where the private key encryption follows
 *
 * @param {string} encryptedData - The encrypted data as a Base64 encoded string.
 * @param {BinaryLike} password - The password used to encrypt the private key.
 * @returns {Uint8Array} The decrypted private key.
 * @throws {Error} Throws an error if decryption fails.
 */
export function kadenaDecrypt(
  password: BinaryLike,
  encryptedData: EncryptedString | BinaryLike,
): Uint8Array {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!encryptedData) {
    throw new Error('Encrypted data is empty');
  }
  const [saltBase64, ivBase64, tagBase64, encryptedBase64] =
    typeof encryptedData === 'string'
      ? Buffer.from(encryptedData, 'base64').toString().split('.')
      : Buffer.from(encryptedData.buffer).toString().split('.');

  // Convert from Base64.
  const salt = Buffer.from(saltBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const cipherText = Buffer.from(encryptedBase64, 'base64');

  // decrypt and return the private key.
  const decrypted = decrypt({ cipherText, iv, tag }, password, salt);
  if (!decrypted) {
    throw new Error('Decryption failed');
  }
  return decrypted;
}

/**
 * Changes the password of an encrypted data.
 *
 * @param {string} privateKey - The encrypted private key as a Base64 encoded string.
 * @param {BinaryLike} password - The current password used to encrypt the private key.
 * @param {string} newPassword - The new password to encrypt the private key with.
 * @returns {string} - The newly encrypted private key as a Base64 encoded string.
 * @throws {Error} - Throws an error if the old password is empty, new password is incorrect empty passwords are empty, or if encryption with the new password fails.
 */
export function kadenaChangePassword(
  password: BinaryLike,
  encryptedData: EncryptedString | Uint8Array,
  newPassword: string,
): EncryptedString {
  if (typeof password !== 'string' || typeof newPassword !== 'string') {
    throw new Error('The old and new passwords must be strings.');
  }
  if (password === '') {
    throw new Error('The old password cannot be empty.');
  }
  if (newPassword === '') {
    throw new Error('The new password cannot be empty.');
  }
  if (password === newPassword) {
    throw new Error(
      'The new password must be different from the old password.',
    );
  }

  let decryptedPrivateKey: Uint8Array;
  try {
    decryptedPrivateKey = kadenaDecrypt(password, encryptedData);
  } catch (error) {
    throw new Error(
      `Failed to decrypt the private key with the old password: ${error.message}`,
    );
  }

  try {
    return kadenaEncrypt(newPassword, decryptedPrivateKey);
  } catch (error) {
    throw new Error(
      `Failed to encrypt the private key with the new password: ${error.message}`,
    );
  }
}
