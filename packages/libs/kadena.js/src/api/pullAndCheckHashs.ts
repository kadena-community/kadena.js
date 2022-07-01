import type { SignatureWithHash } from '@kadena/types';

export function pullAndCheckHashs(sigs: Array<SignatureWithHash>): string {
  const { hash } = sigs[0];
  sigs.forEach((sig) => {
    if (sig.hash !== hash) {
      // eslint-disable-next-line no-console
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  });
  return hash;
}
