import { kadenaDecrypt, kadenaEncrypt } from '../utils/kadenaEncryption';

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
