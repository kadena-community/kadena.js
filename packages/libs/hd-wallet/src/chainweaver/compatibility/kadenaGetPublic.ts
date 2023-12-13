import { EncryptedString } from '../../index.js';
import { getPublicKeyFromLegacySecretKey } from './encryption.js';

export const kadenaGetPublic = (secretKey: EncryptedString): string => {
  return getPublicKeyFromLegacySecretKey(secretKey);
};
