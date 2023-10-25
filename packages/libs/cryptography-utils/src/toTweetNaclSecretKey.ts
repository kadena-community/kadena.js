import type { IKeyPair } from '@kadena/types';
import { hexToBin } from './hexToBin';

/**
 * Converts a keypair into Uint8Array binary object, public key attached to secret key
 * @alpha
 */
export function toTweetNaclSecretKey({
  secretKey,
  publicKey,
}: IKeyPair): Uint8Array {
  return hexToBin(secretKey + publicKey);
}
