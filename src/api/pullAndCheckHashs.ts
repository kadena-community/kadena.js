import { SignCommand, Sig, KeyPair } from '../util';

export function pullAndCheckHashs(sigs: SignCommand[]): string {
  var hsh = sigs[0].hash;
  for (var i = 1; i < sigs.length; i++) {
    if (sigs[i].hash !== hsh) {
      throw new Error(
        'Sigs for different hashes found: ' + JSON.stringify(sigs),
      );
    }
  }
  return hsh;
}
