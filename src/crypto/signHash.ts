import nacl from 'tweetnacl';
import base64UrlDecodeArr from './base64UrlDecodeArr';
import toTweetNaclSecretKey from './toTweetNaclSecretKey';
import binToHex from './binToHex';
import { KeyPair, SignCommand } from '../util';

/**
 Sign a hash using key pair
*/
export default function signHash(
  hsh: string,
  { secretKey, publicKey }: KeyPair,
): SignCommand {
  const hshBin = base64UrlDecodeArr(hsh);
  const sigBin = nacl.sign.detached(
    hshBin,
    toTweetNaclSecretKey({ secretKey, publicKey }),
  );
  return { hash: hsh, sig: binToHex(sigBin), pubKey: publicKey };
}
