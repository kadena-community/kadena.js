import { describe, expect, it } from 'vitest';

import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithKeyPair,
} from '../index.js';

describe('kadenaSignWithKeyPair', async () => {
  const password = 'password';
  const mnemonic = kadenaGenMnemonic();
  const seed = await kadenaMnemonicToSeed(password, mnemonic);

  const [publicKey, privateKey] = await kadenaGenKeypairFromSeed(
    password,
    seed,
    0,
  );

  const txHash: string = 'tx-hash';

  it('should sign a transaction with a public and private key ans password', async () => {
    const signer = kadenaSignWithKeyPair(password, publicKey, privateKey);
    const signature = await signer(txHash);
    expect(signature).toBeTruthy();
    expect(signature.sig.length > 0).toBeTruthy();
  });
});
