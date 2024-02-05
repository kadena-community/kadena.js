import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaSign as originalKadenaSign } from '../kadena-crypto.js';

export const kadenaSign = async (
  password: string | Uint8Array,
  message: string,
  secretKey: EncryptedString,
): Promise<Uint8Array> => {
  return await originalKadenaSign(
    password,
    message,
    await kadenaDecrypt(password, secretKey),
  );
};
