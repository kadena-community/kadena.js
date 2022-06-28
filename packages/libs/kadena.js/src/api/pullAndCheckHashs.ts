import { SignatureWithHash, KeyPair } from '../util';

export default function pullAndCheckHashs(
  sigs: Array<SignatureWithHash>,
): string {
  const { hash } = sigs[0];
  sigs.forEach((sig) => {
    if (sig.hash !== hash) {
      console.log('error');
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  });
  return hash;
}
