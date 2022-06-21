import { SignatureWithHash, KeyPair } from '../util';

export default function pullAndCheckHashs(sigs: SignatureWithHash[]): string {
  const { hash } = sigs[0];
  for (let i = 1; i < sigs.length; i++) {
    if (sigs[i].hash !== hash) {
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  }
  return hash;
}
