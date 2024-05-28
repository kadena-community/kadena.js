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
