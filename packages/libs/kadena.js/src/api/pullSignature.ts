import type { ISignatureJson, SignatureWithHash } from '@kadena/types';

export function pullSignature({ sig }: SignatureWithHash): ISignatureJson {
  return { sig: sig ?? null };
}
