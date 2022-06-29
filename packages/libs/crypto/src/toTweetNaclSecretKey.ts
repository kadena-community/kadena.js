import type { KeyPair } from '@kadena/types';

import { hexToBin } from './hexToBin';

/**
Converts a keypair into Uint8Array binary object, public key attached to secret key
*/
export function toTweetNaclSecretKey({
  secretKey,
  publicKey,
}: KeyPair): Uint8Array {
  return hexToBin(secretKey + publicKey);
}
