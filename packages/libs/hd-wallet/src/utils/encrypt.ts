import {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
  randomBytes,
} from 'crypto';

type BinaryLike = string | NodeJS.ArrayBufferView;

const SALT = Buffer.from('FkM5B23nB6LVY7mrwDeh'); // SALT value used for deriving keys
/**
 * Derive a cryptographic key from the provided password.
 * @param {string} password - User's password.
 * @returns {Buffer} - Returns the derived cryptographic key.
 */
function deriveKey(password: string, salt: BinaryLike): Buffer {
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
  password: string,
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

type Encrypted = ReturnType<typeof encrypt>;

export function encryptPrivateKey(
  privateKey: Uint8Array,
  password: string,
): string {
  // Using randomBytes for the salt is fine here because the salt is not secret but should be unique.
  const salt = randomBytes(16);
  const { cipherText, iv, tag } = encrypt(
    Buffer.from(privateKey),
    password,
    salt,
  );

  return `${salt.toString('base64')}.${iv.toString('base64')}.${tag.toString(
    'base64',
  )}.${cipherText.toString('base64')}`;
}

/**
 * Decrypt the provided encrypted text using AES-256-GCM algorithm.
 * @param {Encrypted} encrypted - Encrypted text, initialization vector, and authentication tag.
 * @param {string} password - User's password.
 * @returns {Buffer | undefined} - Returns the decrypted text or undefined if decryption fails.
 */
export function decrypt(
  encrypted: Encrypted,
  password: string,
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
    console.warn('Failed to decrypt seed');
    return undefined;
  }
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

  // decrypt and return the private key.
  const decrypted = decrypt(
    { cipherText: encryptedBuffer, iv, tag },
    password,
    salt,
  );
  if (!decrypted) {
    throw new Error('Decryption failed');
  }
  return new Uint8Array(decrypted);
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

/**
 * Encrypts the seed buffer with a password or encodes it to Base64 if no password is given.
 * @param {Uint8Array} seedBuffer - The seed buffer to be encrypted or converted.
 * @param {string} password - Optional password used for encryption.
 * @returns {string} - The encrypted string if a password is provided, otherwise the Base64 encoded string.
 */
export function encryptOrEncodeSeed(
  seedBuffer: Uint8Array,
  password?: string,
): string {
  if (password !== undefined) {
    const bufferSeed = Buffer.from(seedBuffer);
    const encrypted = encrypt(bufferSeed, password, SALT);
    const cipherText = bufferToBase64(encrypted.cipherText);
    const iv = bufferToBase64(encrypted.iv);
    const tag = bufferToBase64(encrypted.tag); // Convert the authentication tag to Base64
    return `${cipherText}.${iv}.${tag}`;
  } else {
    return bufferToBase64(Buffer.from(seedBuffer));
  }
}

/* Extracts the seed buffer from a saved seed string, potentially decrypting it if a password is provided.
 * If the saved seed is encrypted, a password must be supplied for decryption.
 *
 * @param {string} seed- The saved seed string, which may be encrypted or in Base64 format.
 * @param {string} [password] - Optional password for decrypting the seed string if encrypted.
 * @returns {Uint8Array} The seed buffer obtained from the saved seed.
 * @throws {Error} Throws an error if the saved seed is not provided, or if decryption fails.
 */
export function extractSeedBuffer(seed: string, password?: string): Uint8Array {
  if (!seed) throw new Error('No seed provided.');
  if (password !== undefined) {
    const [cipherTextBase64, ivBase64, tagBase64] = seed.split('.');
    const decrypted = decrypt(
      {
        cipherText: base64ToBuffer(cipherTextBase64),
        iv: base64ToBuffer(ivBase64),
        tag: base64ToBuffer(tagBase64),
      },
      password,
      SALT,
    );
    if (!decrypted) {
      throw new Error('Failed to decrypt seed.');
    }
    return new Uint8Array(decrypted);
  } else {
    return new Uint8Array(base64ToBuffer(seed));
  }
}
