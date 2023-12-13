import { EncryptedString } from '../../index.js';
import { getPublicKeyFromLegacySecretKey } from './encryption.js';

export const kadenaGetPublic = (secretKey: EncryptedString): Uint8Array => {
  return getPublicKeyFromLegacySecretKey(secretKey);
};
