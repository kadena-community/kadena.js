import hexToBin from './hexToBin';
import { KeyPair } from '../util';

/**
Converts a keypair into Uint8Array binary object, public key attached to secret key
*/
export default function toTweetNaclSecretKey({
  secretKey,
  publicKey,
}: KeyPair): Uint8Array {
  return hexToBin(secretKey + publicKey);
}
