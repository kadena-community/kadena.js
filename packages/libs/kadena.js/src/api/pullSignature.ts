import type { ISignature, SignatureWithHash } from '@kadena/types';

export function pullSignature({ sig }: SignatureWithHash): ISignature {
  return { sig: sig };
}
