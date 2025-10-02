export type BinaryLike = string | ArrayBuffer | Uint8Array | Buffer;

/**
 *
 * @param size - size of random bytes
 * @returns Uint8Array of random bytes
 * @public
 */
export const randomBytes = (size: number) =>
  crypto.getRandomValues(new Uint8Array(size));

export const ToArrayBuffer = (data: BinaryLike): ArrayBuffer => {
  if (typeof data === 'string') {
    return new TextEncoder().encode(data).buffer;
  }
  return new Uint8Array(data).buffer;
};

const DEFAULT_ITERATIONS = 310000;
const LEGACY_ITERATIONS = 1000;

// derive string key
async function deriveKey(
  password: BinaryLike,
  salt: BinaryLike,
  iterations: number,
) {
  const algo = {
    name: 'PBKDF2',
    hash: 'SHA-256',
    salt: typeof salt === 'string' ? new TextEncoder().encode(salt) : salt,
    iterations,
  };
  return crypto.subtle.deriveKey(
    algo,
    await crypto.subtle.importKey(
      'raw',
      ToArrayBuffer(
        typeof password === 'string'
          ? new TextEncoder().encode(password).buffer
          : password,
      ),
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
):Promise<IEncrypted> {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: randomBytes(12),
  } as const;

  return {
    cipherText: new Uint8Array(
      await crypto.subtle.encrypt(
        algo,
        await deriveKey(password, salt, DEFAULT_ITERATIONS),
        ToArrayBuffer(
          typeof text === 'string' ? new TextEncoder().encode(text) : text,
        ),
      ),
    ),
    iv: algo.iv,
    iterations: DEFAULT_ITERATIONS.toString(),
  };
}

interface IEncrypted {
    cipherText: BinaryLike;
    iv: BinaryLike;
    iterations: string;
}

// Decrypt function
export async function decrypt(
  encrypted: IEncrypted,
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
      await deriveKey(
        password,
        salt,
        +encrypted.iterations || LEGACY_ITERATIONS,
      ),
     ToArrayBuffer(encrypted.cipherText),
    ),
  );
}
