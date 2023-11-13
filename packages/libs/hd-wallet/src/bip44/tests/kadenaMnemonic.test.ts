import { describe, expect, it } from 'vitest';

import { kadenaGenMnemonic, kadenaMnemonicToSeed } from '../';

import { kadenaDecrypt } from '../../utils/kadenaEncryption';

describe('kadenaGenMnemonic', () => {
  it('should generate a valid mnemonic', () => {
    const mnemonic = kadenaGenMnemonic();
    expect(mnemonic.split(' ')).toHaveLength(12);
  });
});

describe('kadenaMnemonicToSeed', () => {
  it('should convert mnemonic to encrypt seed with a password', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    expect(typeof seed).toBe('string'); // Check if the seed is a string, indicating it has been encrypted
  });

  it('returns encrypted seed that can be decrypted with the password', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    const decryptedSeed = kadenaDecrypt(password, seed);
    expect(decryptedSeed).toBeTruthy();
  });

  it('should throw an error for an invalid mnemonic', async () => {
    const invalidMnemonic = 'this is not a valid mnemonic';

    await expect(
      kadenaMnemonicToSeed('password', invalidMnemonic),
    ).rejects.toThrowError('Invalid mnemonic.');
  });

  it('should throw an error when mnemonic is empty', async () => {
    const emptyMnemonic = '';

    await expect(
      kadenaMnemonicToSeed('password', emptyMnemonic),
    ).rejects.toThrowError('Invalid mnemonic.');
  });
});
