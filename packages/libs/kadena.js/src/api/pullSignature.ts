import { SignatureWithHash, Signature } from '../util';

export default function pullSignature({ sig }: SignatureWithHash): Signature {
  return { sig: sig };
}
