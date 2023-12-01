import { randomBytes } from 'crypto';
import { deriveKeyPair } from './utils/sign.js';
/**
 * Generates random key pairs without updating the internal state.
 *
 * @param {number} [count=1] - The number of key pairs to generate.
 * @returns {{ publicKey: string; secretKey: string }[]} An array of generated key pairs.
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
