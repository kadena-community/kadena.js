import { describe, expect, it } from 'vitest';

import {
  kadenaGenKeypairFromSeed,
  kadenaGenMnemonic,
  kadenaMnemonicToSeed,
} from '..';

import { kadenaDecrypt } from '../../utils/kadenaEncryption';

describe('kadenaGenKeypairFromSeed', () => {
  it('should generate an encrypted keypair from the seedBuffer when a password is provided', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    const [publicKey, encryptedPrivateKey] = kadenaGenKeypairFromSeed(
      password,
      seed,
      0,
    );

    expect(publicKey).toHaveLength(64);
    expect(typeof encryptedPrivateKey).toBe('string'); // Checks if privateKey is a string, thus encrypted
  });

  it('should generate a range of keypairs from the seed', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    const keyPairs = kadenaGenKeypairFromSeed(password, seed, [0, 3]);
    expect(keyPairs).toHaveLength(4);
    keyPairs.forEach(([publicKey, privateKey]) => {
      expect(publicKey).toHaveLength(64);
      expect(
        Buffer.from(kadenaDecrypt(password, privateKey)).toString('hex'),
      ).toHaveLength(64);
    });
  });

  it('should throw an error for out-of-bounds index values', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    const outOfBoundsIndex = -1;

    expect(() => {
      kadenaGenKeypairFromSeed(password, seed, outOfBoundsIndex);
    }).toThrowError('Invalid child index: -1');
  });

  it('returns an encrypted private key that can be decrypted with the password', async () => {
    const mnemonic = kadenaGenMnemonic();
    const password = 'password';
    const seed = await kadenaMnemonicToSeed(password, mnemonic);
    const [, encryptedPrivateKey] = kadenaGenKeypairFromSeed(password, seed, 0);
    const decryptedPrivateKey = kadenaDecrypt(password, encryptedPrivateKey);
    expect(decryptedPrivateKey).toBeTruthy();
    expect(Buffer.from(decryptedPrivateKey).toString('hex')).toHaveLength(64);
  });

  //   it('should handle the highest non-hardened index without throwing errors', async () => {
  //     const mnemonic = kadenaGenMnemonic();
  //     const { seedBuffer } = await kadenaMnemonicToSeed(mnemonic);

  //     /*
  //      * HD wallets as per BIP32 spec define two types of indices:
  //      * - Non-hardened (ranging from 0 to 2^31 - 1)
  //      * - Hardened (ranging from 2^31 to 2^32 - 1).
  //      * The highest non-hardened index is therefore 2^31 - 1,
  //      * which is the largest 32-bit integer that can be used for generating non-hardened keys.
  //      */

  //     const highestNonHardenedIndex = 2 ** 31 - 1;
  //     expect(() => {
  //       kadenaGenKeypairFromSeed(seedBuffer, highestNonHardenedIndex);
  //     }).not.toThrow();
  //   });
});
