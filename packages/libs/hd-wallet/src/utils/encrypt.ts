import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

/** Constant salt value used for deriving keys
 *  note: not for encrypting/decrypting private key, in that case it should be unique
 */
const SALT: Buffer = Buffer.from('FkM5B23nB6LVY7mrwDeh');

/**
 * Derive a cryptographic key from the provided password and salt.
 * @param {string} password - User's password.
 * @param {Buffer} salt - A unique and random salt.
 * @param {number} iterations - The number of iterations to use.
 * @param {number} keyLength - The desired key length.
 * @param {string} digest - The hash function to use.
 * @returns {Buffer} - Returns the derived cryptographic key.
 */
function deriveKey(
  password: string,
  salt: Buffer,
  iterations: number = 10000,
  keyLength: number = 32,
  digest: string = 'sha256',
): Buffer {
  return pbkdf2Sync(password, salt, iterations, keyLength, digest);
}

/**
 * Encrypt the provided text using AES-256-GCM algorithm.
 * @param {Buffer} text - Text to encrypt.
 * @param {string} password - User's password.
 * @returns {{ cipherText: Buffer; iv: Buffer; tag: Buffer }} - Returns the encrypted text, initialization vector, and authentication tag.
 */
export function encrypt(
  text: Buffer,
  password: string,
): { cipherText: Buffer; iv: Buffer; tag: Buffer } {
  const key = deriveKey(password, SALT);
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

type Encrypted = ReturnType<typeof encrypt>;

/**
 * Decrypt the provided encrypted text using AES-256-GCM algorithm.
 * @param {Encrypted} encrypted - Encrypted text, initialization vector, and authentication tag.
 * @param {string} password - User's password.
 * @returns {Buffer | undefined} - Returns the decrypted text or undefined if decryption fails.
 */
export function decrypt(
  encrypted: Encrypted,
  password: string,
): Buffer | undefined {
  const key = deriveKey(password, SALT);
  const decipher = createDecipheriv('aes-256-gcm', key, encrypted.iv);
  decipher.setAuthTag(encrypted.tag);
  try {
    return Buffer.concat([
      decipher.update(encrypted.cipherText),
      decipher.final(),
    ]);
  } catch (err) {
    console.warn('Failed to decrypt seed');
    return undefined;
  }
}

/**
 * Convert a Buffer to a Base64 encoded string.
 * @param {Buffer} buffer - Buffer to convert.
 * @returns {string} - Returns the Base64 encoded string.
 */
export function bufferToBase64(buffer: Buffer): string {
  return buffer.toString('base64');
}

/**
 * Convert a Base64 encoded string to a Buffer.
 * @param {string} base64 - Base64 encoded string to convert.
 * @returns {Buffer} - Returns the resulting Buffer.
 */
export function base64ToBuffer(base64: string): Buffer {
  return Buffer.from(base64, 'base64');
}

export function encryptPrivateKey(
  privateKey: Uint8Array,
  password: string,
): string {
  // Generate a random salt because we need one for encryption and it should be unique;
  const salt = randomBytes(16);
  const key = deriveKey(password, salt);
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);

  const encrypted = Buffer.concat([
    cipher.update(Buffer.from(privateKey)),
    cipher.final(),
  ]);

  // Get the authentication tag.
  const tag = cipher.getAuthTag();

  // Return the combined encrypted data, salt, IV, and tag.
  return `${salt.toString('base64')}.${iv.toString('base64')}.${tag.toString(
    'base64',
  )}.${Buffer.from(encrypted).toString('base64')}`;
}

export function decryptPrivateKey(
  encryptedData: string,
  password: string,
): Uint8Array {
  const [saltBase64, ivBase64, tagBase64, encrypted] = encryptedData.split('.');

  // Convert from Base64.
  const salt = Buffer.from(saltBase64, 'base64');
  const iv = Buffer.from(ivBase64, 'base64');
  const tag = Buffer.from(tagBase64, 'base64');
  const encryptedBuffer = Buffer.from(encrypted, 'base64');

  const key = deriveKey(password, salt);

  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);

  try {
    // Decrypt and return the private key.
    const decrypted = Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final(),
    ]);
    return new Uint8Array(decrypted);
  } catch (err) {
    console.error('Failed to decrypt:', err);
    throw new Error('Decryption failed');
  }
}
