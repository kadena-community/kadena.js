export type BinaryLike = string | ArrayBuffer | Uint8Array;

/**
 *
 * @param size - size of random bytes
 * @returns Uint8Array of random bytes
 * @public
 */
export const randomBytes = (size: number) =>
  crypto.getRandomValues(new Uint8Array(size));

// derive string key
async function deriveKey(password: BinaryLike, salt: BinaryLike) {
  const algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: typeof salt === 'string' ? new TextEncoder().encode(salt) : salt,
    iterations: 1000,
  };
  return crypto.subtle.deriveKey(
    algo,
    await crypto.subtle.importKey(
      'raw',
      typeof password === 'string'
        ? new TextEncoder().encode(password)
        : password,
      {
        name: algo.name,
      },
      false,
      ['deriveKey'],
    ),
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
}

// Encrypt function
export async function encrypt(
  text: BinaryLike,
  password: BinaryLike,
  salt: BinaryLike,
) {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: randomBytes(12),
  } as const;
  return {
    cipherText: new Uint8Array(
      await crypto.subtle.encrypt(
        algo,
        await deriveKey(password, salt),
        //   new TextEncoder().encode(text)
        typeof text === 'string' ? new TextEncoder().encode(text) : text,
      ),
    ),
    iv: algo.iv,
  };
}

type Encrypted = Awaited<ReturnType<typeof encrypt>>;

// Decrypt function
export async function decrypt(
  encrypted: Encrypted,
  password: BinaryLike,
  salt: BinaryLike,
) {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: encrypted.iv,
  };
  return new Uint8Array(
    await crypto.subtle.decrypt(
      algo,
      await deriveKey(password, salt),
      encrypted.cipherText,
    ),
  );
}

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
export async function kadenaEncrypt(
  password: BinaryLike,
  message: BinaryLike,
): Promise<[Uint8Array, Uint8Array, Uint8Array]> {
  // Using randomBytes for the salt is fine here because the salt is not secret but should be unique.
  const salt = randomBytes(16);
  const { cipherText, iv } = await encrypt(
    typeof message === 'string' ? new TextEncoder().encode(message) : message,
    password,
    salt,
  );

  return [salt, iv, cipherText];
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
  encryptedData: [Uint8Array, Uint8Array, Uint8Array],
): Promise<Uint8Array> {
  if (!encryptedData) {
    throw new Error('Encrypted data is empty');
  }
  const [salt, iv, cipherText] = encryptedData;

  // decrypt and return the private key.

  const decrypted = await decrypt({ cipherText, iv }, password, salt).catch(
    () => undefined,
  );
  if (decrypted) return new Uint8Array(decrypted);

  throw new Error('Decryption failed');
}

export const unit8arrayToString = (unit8array: Uint8Array) =>
  new TextDecoder().decode(unit8array);

export const stringToUint8Array = (str: string) =>
  new TextEncoder().encode(str);
