import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaSign as originalKadenaSign } from '../kadena-crypto.js';

export const kadenaSign = async (
  password: string | Uint8Array,
  message: string,
  secretKey: EncryptedString | Uint8Array,
): Promise<Uint8Array> => {
  return await originalKadenaSign(
    password,
    Buffer.from(message, 'base64'),
    await kadenaDecrypt(password, secretKey),
  );
};
