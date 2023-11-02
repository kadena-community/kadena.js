import { describe, expect, it } from 'vitest';
import {
  kadenaGenKeypair,
  kadenaGenMnemonic,
  kadenaMnemonicToRootKeypair,
} from '../chainweaver';

describe('kadenaGenMnemonic', () => {
  it('should generate a mnemonic', () => {
    const words: string = kadenaGenMnemonic();
    expect(words.split(' ')).toHaveLength(12);
  });
});

describe('kadenaMnemonicToRootKeypair', () => {
  it('should generate a Root key from mnemonic', () => {
    const words: string =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = kadenaMnemonicToRootKeypair(password, words);
    expect(rootKey).toHaveLength(128);
  });
});

describe('kadenaGenKeypair', () => {
  it('should generate keypair frpm the rootKey', () => {
    const words: string =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = kadenaMnemonicToRootKeypair(password, words);
    const [encryptedSecret, publicKey] = kadenaGenKeypair(
      password,
      rootKey,
      0x80000000 + 1,
    );
    expect(encryptedSecret.byteLength).toEqual(128);
    expect(publicKey.byteLength).toBe(32);
  });
});
