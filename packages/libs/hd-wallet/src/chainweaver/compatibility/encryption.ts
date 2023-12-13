import { EncryptedString, kadenaEncrypt } from '../../index.js';

export function encryptLegacySecretKey(
  password: string,
  secretKey: Uint8Array,
): EncryptedString {
  const xpub = secretKey.slice(64, 96);
  const encryptedSecret = kadenaEncrypt(password, secretKey);
  // Add public key to the encrypted secret
  const encrypted = Buffer.from(encryptedSecret, 'base64').toString();
  const publicKey = Buffer.from(xpub).toString('base64');
  const result = Buffer.from(`${encrypted}.${publicKey}`).toString('base64');
  return result as EncryptedString;
}

export function getPublicKeyFromLegacySecretKey(
  secretKey: EncryptedString,
): Uint8Array {
  // prettier-ignore
  const publicKeyBase64 = Buffer.from(secretKey, 'base64').toString().split('.').pop();
  if (!publicKeyBase64) throw Error('Invalid secret key');
  return Buffer.from(publicKeyBase64, 'base64');
}
