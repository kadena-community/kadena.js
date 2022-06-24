import { SignatureWithHash, KeyPair } from '../util';

export default function pullAndCheckHashs(sigs: SignatureWithHash[]): string {
  const { hash } = sigs[0];
  sigs.forEach((sig) => {
    if (sig.hash !== hash) {
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  });
  return hash;
}
