import { SignCommand, Sig, KeyPair } from '../util';

export function pullSig({ hash, sig, pubKey }: SignCommand): Sig {
  return { sig: sig };
}
