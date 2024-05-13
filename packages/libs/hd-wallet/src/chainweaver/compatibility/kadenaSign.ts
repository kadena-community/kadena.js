import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaSign as originalKadenaSign } from '../kadena-crypto.js';

export const kadenaSign = async (
  password: string | Uint8Array,
  hash: string, // base64 message
  secretKey: EncryptedString | Uint8Array,
): Promise<Uint8Array> => {
  return await originalKadenaSign(
    password,
    Buffer.from(hash, 'base64'),
    await kadenaDecrypt(password, secretKey),
  );
};
