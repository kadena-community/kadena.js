import nacl from 'tweetnacl';
import base64UrlDecodeArr from './base64UrlDecodeArr';
import toTweetNaclSecretKey from './toTweetNaclSecretKey';
import binToHex from './binToHex';
import { KeyPair, SignatureWithHash } from '../util';

/**
 Sign a hash using key pair
*/
export default function signHash(
  hash: string,
  { secretKey, publicKey }: KeyPair,
): SignatureWithHash {
  const hshBin = base64UrlDecodeArr(hash);
  const sigBin = nacl.sign.detached(
    hshBin,
    toTweetNaclSecretKey({ secretKey, publicKey }),
  );
  return { hash, sig: binToHex(sigBin), pubKey: publicKey };
}
