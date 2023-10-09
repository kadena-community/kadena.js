/** Constant salt value used for deriving keys */
const SALT: string = 'FkM5B23nB6LVY7mrwDeh';

/**
 * Derive a cryptographic key from the provided password.
 * @param {string} password - User's password.
 * @returns {Promise<CryptoKey>} - Returns the derived cryptographic key.
 */
async function deriveKey(password: string): Promise<CryptoKey> {
  const algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: new TextEncoder().encode(SALT),
    iterations: 1000,
  };
  return crypto.subtle.deriveKey(
    algo,
    await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      { name: algo.name },
      false,
      ['deriveKey'],
    ),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

/**
 * Encrypt the provided text using AES-GCM algorithm.
 * @param {ArrayBuffer} text - Text to encrypt.
 * @param {string} password - User's password.
 * @returns {Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }>} - Returns the encrypted text and initialization vector.
 */
export async function encrypt(
  text: ArrayBuffer,
  password: string,
): Promise<{ cipherText: ArrayBuffer; iv: Uint8Array }> {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: crypto.getRandomValues(new Uint8Array(12)),
  } as const;
  return {
    cipherText: await crypto.subtle.encrypt(
      algo,
      await deriveKey(password),
      text,
    ),
    iv: algo.iv,
  };
}

type Encrypted = Awaited<ReturnType<typeof encrypt>>;

/**
 * Decrypt the provided encrypted text using AES-GCM algorithm.
 * @param {Encrypted} encrypted - Encrypted text and initialization vector.
 * @param {string} password - User's password.
 * @returns {Promise<ArrayBuffer | undefined>} - Returns the decrypted text or undefined if decryption fails.
 */
export async function decrypt(
  encrypted: Encrypted,
  password: string,
): Promise<ArrayBuffer | undefined> {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: encrypted.iv,
  };
  return await crypto.subtle
    .decrypt(algo, await deriveKey(password), encrypted.cipherText)
    .catch(() => {
      console.warn('Failed to decrypt seed');
      return undefined;
    });
}

/**
 * Convert an ArrayBuffer to a Base64 encoded string.
 * @param {ArrayBuffer} buffer - Buffer to convert.
 * @returns {string} - Returns the Base64 encoded string.
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  return Buffer.from(buffer).toString('base64');
}

/**
 * Convert a Base64 encoded string to an ArrayBuffer.
 * @param {string} base64 - Base64 encoded string to convert.
 * @returns {Uint8Array} - Returns the resulting ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): Uint8Array {
  return Buffer.from(base64, 'base64');
}
