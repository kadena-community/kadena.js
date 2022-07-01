import type { Signature, SignatureWithHash } from '@kadena/types';

export function pullSignature({ sig }: SignatureWithHash): Signature {
  return { sig: sig };
}
