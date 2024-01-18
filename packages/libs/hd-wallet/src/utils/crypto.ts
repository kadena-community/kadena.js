import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

type BinaryLike = string | NodeJS.ArrayBufferView;

/**
 * Derive a cryptographic key from the provided password.
 * @param {string} password - User's password.
 * @returns {Buffer} - Returns the derived cryptographic key.
 */
function deriveKey(password: BinaryLike, salt: BinaryLike): Buffer {
  return pbkdf2Sync(password, salt, 1000, 32, 'sha256');
}

/**
 * Encrypt the provided text using AES-256-GCM algorithm.
 * @param {Buffer} text - Text to encrypt.
 * @param {string} password - User's password.
 * @returns {{ cipherText: Buffer; iv: Buffer; tag: Buffer }} - Returns the encrypted text, initialization vector, and authentication tag.
 */
export function encrypt(
  text: Buffer,
  password: BinaryLike,
  salt: BinaryLike,
): { cipherText: Buffer; iv: Buffer; tag: Buffer } {
  const key = deriveKey(password, salt);
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const cipherText = Buffer.concat([cipher.update(text), cipher.final()]);
  const tag = cipher.getAuthTag(); // Capture the authentication tag
  return {
    cipherText,
    iv,
    tag,
  };
}

/**
 * Decrypt the provided encrypted text using AES-256-GCM algorithm.
 * @param encrypted - Encrypted text, initialization vector, and authentication tag.
 * @param password - User's password.
 * @returns  Returns the decrypted text or undefined if decryption fails.
 * @internal
 */
export function decrypt(
  encrypted: {
    cipherText: Buffer;
    iv: Buffer;
    tag: Buffer;
  },
  password: BinaryLike,
  salt: BinaryLike,
): Buffer | undefined {
  const key = deriveKey(password, salt);
  const decipher = createDecipheriv('aes-256-gcm', key, encrypted.iv);
  decipher.setAuthTag(encrypted.tag); // Set the authentication tag
  try {
    return Buffer.concat([
      decipher.update(encrypted.cipherText),
      decipher.final(),
    ]);
  } catch (err) {
    console.warn('Failed to decrypt');
    return undefined;
  }
}

export const HARDENED_OFFSET = 0x80000000;
export const harden = (n: number) => HARDENED_OFFSET + n;
