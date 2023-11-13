import { describe, expect, it } from 'vitest';

import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithKeyPair,
} from '..';

import type { IUnsignedCommand } from '@kadena/client';

describe.only('kadenaSignWithKeyPair', async () => {
  const password = 'password';
  const mnemonic = kadenaGenMnemonic();
  const seed = await kadenaMnemonicToSeed(password, mnemonic);

  const [publicKey, privateKey] = kadenaGenKeypairFromSeed(password, seed, 0);

  const mockUnsignedCommand: IUnsignedCommand = {
    cmd: '{"command":"value"}',
    hash: 'kadena-hash',
    sigs: [],
  };

  it('should sign a transaction with a public and private key ans password', () => {
    const signer = kadenaSignWithKeyPair(password, publicKey, privateKey);

    const signedTx = signer(mockUnsignedCommand);

    expect(signedTx).toHaveProperty('sigs');
    expect(signedTx.sigs).toBeInstanceOf(Array);
    expect(signedTx.sigs.length).toBeGreaterThan(0);
    expect(signedTx.sigs[0]).toHaveProperty('sig');
    expect(signedTx.sigs[0].sig).toBeTruthy();
  });
});
