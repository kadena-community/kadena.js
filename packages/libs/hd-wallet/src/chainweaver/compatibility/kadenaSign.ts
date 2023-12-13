import { EncryptedString, kadenaDecrypt } from '../../index.js';
import { kadenaSign as originalKadenaSign } from '../kadena-crypto.js';

export const kadenaSign = async (
  password: string,
  message: string,
  secretKey: EncryptedString,
): Promise<Uint8Array> => {
  return await originalKadenaSign(
    password,
    message,
    kadenaDecrypt(password, secretKey),
  );
};
