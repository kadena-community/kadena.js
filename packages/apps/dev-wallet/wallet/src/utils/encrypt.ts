const SALT = "FkM5B23nB6LVY7mrwDeh";

// derive string key
async function deriveKey(password: string) {
  const algo = {
    name: "PBKDF2",
    hash: "SHA-256",
    salt: new TextEncoder().encode(SALT),
    iterations: 1000,
  };
  return crypto.subtle.deriveKey(
    algo,
    await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(password),
      {
        name: algo.name,
      },
      false,
      ["deriveKey"]
    ),
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt function
export async function encrypt(text: ArrayBuffer, password: string) {
  const algo = {
    name: "AES-GCM",
    length: 256,
    iv: crypto.getRandomValues(new Uint8Array(12)),
  } as const;
  return {
    cipherText: await crypto.subtle.encrypt(
      algo,
      await deriveKey(password),
      //   new TextEncoder().encode(text)
      text
    ),
    iv: algo.iv,
  };
}

type Encrypted = Awaited<ReturnType<typeof encrypt>>;

// Decrypt function
export async function decrypt(encrypted: Encrypted, password: string) {
  const algo = {
    name: "AES-GCM",
    length: 256,
    iv: encrypted.iv,
  };
  return await crypto.subtle
    .decrypt(algo, await deriveKey(password), encrypted.cipherText)
    .catch(() => {
      console.warn("Failed to decrypt seed");
      return null;
    });
}

export function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
export function base64ToArrayBuffer(base64: string) {
  const binary_string = window.atob(base64);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes;
}
