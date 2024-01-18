export type BinaryLike = string | DataView | Uint8Array;

// derive string key
async function deriveKey(password: string, salt: BinaryLike) {
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
      new TextEncoder().encode(password),
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
  text: ArrayBuffer,
  password: string,
  salt: BinaryLike,
) {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: crypto.getRandomValues(new Uint8Array(12)),
  } as const;
  return {
    cipherText: await crypto.subtle.encrypt(
      algo,
      await deriveKey(password, salt),
      //   new TextEncoder().encode(text)
      text,
    ),
    iv: algo.iv,
  };
}

type Encrypted = Awaited<ReturnType<typeof encrypt>>;

// Decrypt function
export async function decrypt(
  encrypted: Encrypted,
  password: string,
  salt: BinaryLike,
) {
  const algo = {
    name: 'AES-GCM',
    length: 256,
    iv: encrypted.iv,
  };
  return await crypto.subtle
    .decrypt(algo, await deriveKey(password, salt), encrypted.cipherText)
    .catch(() => {
      console.warn('Failed to decrypt seed');
      return null;
    });
}
