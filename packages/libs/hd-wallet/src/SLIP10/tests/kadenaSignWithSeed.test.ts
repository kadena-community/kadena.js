import { describe, expect, it } from 'vitest';

import {
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
  kadenaSignWithSeed,
} from '../index.js';

import type { IUnsignedCommand } from '@kadena/client';

describe('kadenaSignWithSeed', async () => {
  const password = 'password';
  const mnemonic = kadenaGenMnemonic();
  const seed = await kadenaMnemonicToSeed(password, mnemonic);
  const index = 0;
  const mockUnsignedCommand: IUnsignedCommand = {
    cmd: '{"commands":"value"}',
    hash: 'kadena-hash',
    sigs: [],
  };

  it('should sign a transaction with a seed and index', () => {
    const signer = kadenaSignWithSeed(password, seed, index);
    const signedTx = signer(mockUnsignedCommand);
    expect(signedTx).toHaveProperty('sigs');
    expect(signedTx.sigs).toBeInstanceOf(Array);
    expect(signedTx.sigs[0]).toHaveProperty('sig');
    expect(signedTx.sigs[0].sig).toBeTruthy();
  });
});
