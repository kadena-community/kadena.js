import nacl from 'tweetnacl';
import hashBin from './hashBin';
import binToHex from './binToHex';
import base64UrlEncodeArr from './base64UrlEncodeArr';
import toTweetNaclSecretKey from './toTweetNaclSecretKey';
import { KeyPair, SignCommand } from '../util';

/**
Perform blake2b256 hashing on a message, and sign using keyPair.
*/

export default function sign(
  msg: string,
  { secretKey, publicKey }: KeyPair,
): SignCommand {
  const hshBin = hashBin(msg);
  const hsh = base64UrlEncodeArr(hshBin);
  const sigBin = nacl.sign.detached(
    hshBin,
    toTweetNaclSecretKey({ secretKey, publicKey }),
  );
  return { hash: hsh, sig: binToHex(sigBin), pubKey: publicKey };
}
