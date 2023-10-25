import type { IKeyPair, SignCommand } from '@kadena/types';
import nacl from 'tweetnacl';
import { base64UrlEncodeArr } from './base64UrlEncodeArr';
import { binToHex } from './binToHex';
import { hashBin } from './hashBin';
import { toTweetNaclSecretKey } from './toTweetNaclSecretKey';

/**
Perform blake2b256 hashing on a message, and sign using keyPair.

 * @alpha
*/

export function sign(
  msg: string,
  { secretKey, publicKey }: IKeyPair,
): SignCommand {
  const hshBin = hashBin(msg);
  const hsh = base64UrlEncodeArr(hshBin);
  const sigBin = nacl.sign.detached(
    hshBin,
    toTweetNaclSecretKey({ secretKey, publicKey }),
  );

  return { hash: hsh, sig: binToHex(sigBin), pubKey: publicKey };
}
