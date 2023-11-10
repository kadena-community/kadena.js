import { randomBytes } from 'crypto';
import { decrypt, encrypt } from './crypto';

/**
 * Encrypts the message with a password .
 * @param {Uint8Array} message - The message to be encrypted.
 * @param {string} password - password used for encryption.
 * @returns {string} - The encrypted string
 */

export function kadenaEncrypt(message: Uint8Array, password: string): string {
  // Using randomBytes for the salt is fine here because the salt is not secret but should be unique.
  const salt = randomBytes(16);
  const { cipherText, iv, tag } = encrypt(Buffer.from(message), password, salt);

  return [salt, iv, tag, cipherText].map((x) => x.toString('base64')).join('.');
}

/**
 * Decrypts an encrypted message using the provided password.
 * This function is a wrapper for the internal decryption logic, intended
 * for public-facing API usage where the private key encryption follows
 *
 * @param {string} encryptedData - The encrypted data as a Base64 encoded string.
 * @param {string} password - The password used to encrypt the private key.
 * @returns {Uint8Array} The decrypted private key.
 * @throws {Error} Throws an error if decryption fails.
 */
export function kadenaDecrypt(
  encryptedData: string,
  password: string,
): Uint8Array {
  const [saltBase64, ivBase64, tagBase64, encryptedBase64] =
    encryptedData.split('.');
  console.log({ saltBase64, ivBase64, tagBase64, encryptedBase64 });

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
  return new Uint8Array(decrypted);
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
