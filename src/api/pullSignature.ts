import { SignatureWithHash, Signature, KeyPair } from '../util';

export default function pullSignature({
  hash,
  sig,
  pubKey,
}: SignatureWithHash): Signature {
  return { sig: sig };
}
