import { randomBytes } from '../utils/crypto.js';
import { deriveKeyPair } from './utils/sign.js';
/**
 * Generates random key pairs without updating the internal state.
 *
 * @param count - The number of key pairs to generate default is `1`.
 * @returns An array of generated key pairs.
 * @public
 */
export function kadenaKeyPairsFromRandom(
  count: number = 1,
): { publicKey: string; secretKey: string }[] {
  const keyPairs: { publicKey: string; secretKey: string }[] = [];
  for (let index = 0; index < count; index++) {
    const randomSeedBuffer = randomBytes(32);
    const derivationPath = `m'/44'/626'/${index}'`;
    const pair = deriveKeyPair(randomSeedBuffer, derivationPath);

    keyPairs.push({
      publicKey: pair.publicKey,
      secretKey: pair.privateKey,
    });
  }

  return keyPairs;
}
