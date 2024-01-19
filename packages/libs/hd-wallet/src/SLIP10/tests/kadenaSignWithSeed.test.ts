import { describe, expect, it } from 'vitest';

import {
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '../index.js';

describe('kadenaSignWithSeed', async () => {
  const password = 'password';
  const mnemonic = kadenaGenMnemonic();
  const seed = await kadenaMnemonicToSeed(password, mnemonic);
  const index = 0;
  const hash = 'transaction-hash';

  it('should sign a transaction with a seed and index', () => {
    const signer = kadenaSignWithSeed(password, seed, index);
    const signature = signer(hash);
    expect(signature).toBeTruthy();
    expect(signature.sig.length > 0).toBeTruthy();
  });
});
