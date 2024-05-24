import type { BinaryLike } from './crypto.js';
import { decrypt, encrypt, randomBytes } from './crypto.js';

/**
 * @public
 */
export type EncryptedString = string & { _brand: 'EncryptedString' };

/**
 * Encrypts the message with a password .
 * @param message - The message to be encrypted.
 * @param password - password used for encryption.
 * @returns The encrypted string
 * @public
 */
export async function kadenaEncrypt<
  TEncode extends 'base64' | 'buffer' = 'base64',
  TReturn = TEncode extends 'base64' ? EncryptedString : Uint8Array,
>(
  password: BinaryLike,
  message: BinaryLike,
  encode: TEncode = 'base64' as TEncode,
): Promise<TReturn> {
  // Using randomBytes for the salt is fine here because the salt is not secret but should be unique.
  const salt = randomBytes(16);
  const { cipherText, iv } = await encrypt(
    typeof message === 'string' ? Buffer.from(message) : message,
    password,
    salt,
  );

  const encrypted = Buffer.from(
    [salt, iv, cipherText]
      .map((x) => Buffer.from(x).toString('base64'))
      .join('.'),
  );

  return (
    encode === 'base64' ? encrypted.toString('base64') : encrypted
  ) as TReturn;
}

/**
 * Decrypts an encrypted message using the provided password.
 * This function is a wrapper for the internal decryption logic, intended
 * for public-facing API usage where the private key encryption follows
 *
 * @param encryptedData - The encrypted data as a Base64 encoded string.
 * @param password - The password used to encrypt the private key.
 * @returns The decrypted private key.
 * @throws Throws an error if decryption fails.
 * @public
 */
export async function kadenaDecrypt(
  password: BinaryLike,
  encryptedData: BinaryLike,
): Promise<Uint8Array> {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!encryptedData) {
    throw new Error('Encrypted data is empty');
  }
  const [saltBase64, ivBase64, encryptedBase64] =
    typeof encryptedData === 'string'
      ? Buffer.from(encryptedData, 'base64').toString().split('.')
      : Buffer.from(encryptedData).toString().split('.');

  // Convert from Base64.
  const salt = Buffer.from(saltBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');
  const cipherText = Buffer.from(encryptedBase64, 'base64');

  // decrypt and return the private key.

  const decrypted = await decrypt({ cipherText, iv }, password, salt).catch(
    () => undefined,
  );
  if (decrypted) return new Uint8Array(decrypted);

  throw new Error('Decryption failed');
}

/**
 * Changes the password of an encrypted data.
 *
 * @param privateKey - The encrypted private key as a Base64 encoded string.
 * @param password - The current password used to encrypt the private key.
 * @param newPassword - The new password to encrypt the private key with.
 * @returns The newly encrypted private key as a Base64 encoded string.
 * @throws Throws an error if the old password is empty, new password is incorrect empty passwords are empty, or if encryption with the new password fails.
 * @public
 */
export async function kadenaChangePassword(
  password: BinaryLike,
  encryptedData: BinaryLike,
  newPassword: string,
): Promise<EncryptedString> {
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
    decryptedPrivateKey = await kadenaDecrypt(password, encryptedData);
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
