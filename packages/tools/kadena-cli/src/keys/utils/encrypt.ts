import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

/** Constant salt value used for deriving keys */
const SALT: string = 'FkM5B23nB6LVY7mrwDeh';

/**
 * Derive a cryptographic key from the provided password.
 * @param {string} password - User's password.
 * @returns {Buffer} - Returns the derived cryptographic key.
 */
function deriveKey(password: string): Buffer {
  return pbkdf2Sync(password, SALT, 1000, 32, 'sha256');
}

/**
 * Encrypt the provided text using AES-256-GCM algorithm.
 * @param {Buffer} text - Text to encrypt.
 * @param {string} password - User's password.
 * @returns {{ cipherText: Buffer; iv: Buffer }} - Returns the encrypted text and initialization vector.
 */
export function encrypt(
  text: Buffer,
  password: string,
): { cipherText: Buffer; iv: Buffer } {
  const iv = randomBytes(12);
  const key = deriveKey(password);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const cipherText = Buffer.concat([cipher.update(text), cipher.final()]);
  return { cipherText, iv };
}

/**
 * Decrypt the provided encrypted text using AES-256-GCM algorithm.
 * @param {Buffer} cipherText - Encrypted text.
 * @param {Buffer} iv - Initialization vector.
 * @param {string} password - User's password.
 * @returns {Buffer | undefined} - Returns the decrypted text or undefined if decryption fails.
 */
export function decrypt(
  cipherText: Buffer,
  iv: Buffer,
  password: string,
): Buffer | undefined {
  try {
    const key = deriveKey(password);
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]);
  } catch (error) {
    console.warn('Failed to decrypt seed');
    return undefined;
  }
}

/**
 * Convert an ArrayBuffer to a Base64 encoded string.
 * @param {Buffer} buffer - Buffer to convert.
 * @returns {string} - Returns the Base64 encoded string.
 */
export function arrayBufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Convert a Base64 encoded string to an ArrayBuffer.
 * @param {string} base64 - Base64 encoded string to convert.
 * @returns {Buffer} - Returns the resulting ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}
