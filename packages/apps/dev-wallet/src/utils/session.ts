import { kadenaDecrypt, kadenaEncrypt } from '@kadena/hd-wallet';

// add expiration to the session
export async function setSession(
  sessionKey: string,
  sessionValue: Record<string, Uint8Array> | null,
) {
  if (!sessionValue) return;
  const encrypted: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(sessionValue)) {
    encrypted.push({
      key: await kadenaEncrypt('key', key),
      value: await kadenaEncrypt(key, value),
    });
  }
  localStorage.setItem(sessionKey, JSON.stringify(encrypted));
}

export async function getSession(sessionKey: string) {
  const data = localStorage.getItem(sessionKey);
  if (!data) return null;
  const encrypted = JSON.parse(data);
  const decrypted: Record<string, Uint8Array> = {};
  for (const { key, value } of encrypted) {
    const decryptedKey = new TextDecoder().decode(
      await kadenaDecrypt('key', key),
    );
    decrypted[decryptedKey] = await kadenaDecrypt(decryptedKey, value);
  }
  return decrypted;
}
