import { describe, expect, it } from 'vitest';
import {
  kadenaGenKeypair,
  kadenaGenMnemonic,
  kadenaMnemonicToRootKeypair,
  kadenaSignFromRootKey,
} from '../index.js';

const toHexStr = (bytes: Uint8Array) => Buffer.from(bytes).toString('hex');

describe('kadenaGenMnemonic', () => {
  it('should generate a mnemonic', () => {
    const mnemonic = kadenaGenMnemonic();
    const wordsList = mnemonic.split(' ');
    expect(wordsList).toHaveLength(12);
    expect(wordsList.every((word) => word.length > 2)).toBe(true);
  });
});

describe('kadenaMnemonicToRootKeypair', () => {
  it('should generate a Root key from mnemonic', async () => {
    const mnemonic =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = await kadenaMnemonicToRootKeypair(password, mnemonic);
    expect(rootKey).toBeTruthy();
  });

  it('should generate a the same root key from the same mnemonic', async () => {
    const mnemonic =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey1 = await kadenaMnemonicToRootKeypair(password, mnemonic);
    const rootKey2 = await kadenaMnemonicToRootKeypair(password, mnemonic);

    // not equal due to encryption salt.
    expect(rootKey1).not.toBe(rootKey2);
  });

  it('should generate different root key for different mnemonic', async () => {
    const mnemonicFirst =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';

    const mnemonicSecond =
      'tuna nerve predict all catch early oblige inform hamster magnet century goddess';
    const password = 'password';
    const rootKey1 = await kadenaMnemonicToRootKeypair(password, mnemonicFirst);
    const rootKey2 = await kadenaMnemonicToRootKeypair(
      password,
      mnemonicSecond,
    );

    expect(rootKey1).not.toBe(rootKey2);
  });

  it('should generate different root key for different passwords same mnemonic', async () => {
    const mnemonic =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const rootKey1 = await kadenaMnemonicToRootKeypair('pass-one', mnemonic);
    const rootKey2 = await kadenaMnemonicToRootKeypair('pass-two', mnemonic);

    expect(rootKey1).not.toBe(rootKey2);
  });
});

describe('kadenaGenKeypair', () => {
  it('should generate keypair frpm the rootKey', async () => {
    const mnemonic: string =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = await kadenaMnemonicToRootKeypair(password, mnemonic);
    const { publicKey, secretKey } = await kadenaGenKeypair(
      password,
      rootKey,
      1,
    );
    expect(secretKey.length).toBeTruthy();
    expect(publicKey.length).toBe(64);
  });

  it('should generate a range of keypairs frpm the rootKey', async () => {
    const mnemonic: string =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = await kadenaMnemonicToRootKeypair(password, mnemonic);
    const keyPairs = await kadenaGenKeypair(password, rootKey, [0, 3]);
    expect(keyPairs).toHaveLength(4);
    keyPairs.forEach(({ publicKey, secretKey }) => {
      expect(secretKey.length).toBeTruthy();
      expect(publicKey.length).toBe(64);
    });
  });

  it('should generate a valid signature', async () => {
    const mnemonic: string =
      'bubble fade wasp analyst then panel desert hold spatial sound lucky weekend';
    const password = 'password';
    const rootKey = await kadenaMnemonicToRootKeypair(password, mnemonic);
    const signature = await kadenaSignFromRootKey(
      password,
      'hello',
      rootKey,
      1,
    );
    expect(signature).toBeTruthy();
  });
});
