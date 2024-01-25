import type { EncryptedString } from '../../index.js';
import { kadenaDecrypt } from '../../index.js';
import { kadenaChangePassword as originalKadenaChangePassword } from '../kadena-crypto.js';
import { encryptLegacySecretKey } from './encryption.js';

export const kadenaChangePassword = async (
  secretKey: EncryptedString,
  oldPassword: string,
  newPassword: string,
): Promise<EncryptedString> => {
  const newSecretKey = await originalKadenaChangePassword(
    await kadenaDecrypt(oldPassword, secretKey),
    oldPassword,
    newPassword,
  );
  return encryptLegacySecretKey(newPassword, newSecretKey);
};
