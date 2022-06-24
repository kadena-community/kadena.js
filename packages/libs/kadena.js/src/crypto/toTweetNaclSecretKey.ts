import type { KeyPair } from '../util';

import hexToBin from './hexToBin';

/**
Converts a keypair into Uint8Array binary object, public key attached to secret key
*/
export default function toTweetNaclSecretKey({
  secretKey,
  publicKey,
}: KeyPair): Uint8Array {
  return hexToBin(secretKey + publicKey);
}
