import { describe, expect, it } from 'vitest';
import { kadenaDecrypt } from '../../index.js';
import { getPublicKeyFromLegacySecretKey } from '../compatibility/encryption.js';
import {
  kadenaCheckMnemonic,
  kadenaGenKeypair,
  kadenaGenMnemonic,
  kadenaMnemonicToRootKeypair,
  kadenaSignFromRootKey,
} from '../index.js';

const PASSWORD = 'kadena';
const MNEMONIC =
  'mammal east oxygen romance wheel chimney frequent brain spawn owner announce sell';

function validateEncryptedValue(value: string) {
  const buffer = Buffer.from(value, 'base64').toString('utf8');
  const parts = buffer.split('.');
  // parts: salt, iv, tag, data, public key (only for secretKeys, not rootKey)
  return parts.length === 4 || parts.length === 5;
}

describe('kadenaGenMnemonic', () => {
  it('should generate a mnemonic', () => {
    const mnemonic = kadenaGenMnemonic();
    const wordsList = mnemonic.split(' ');
    expect(wordsList).toHaveLength(12);
    expect(wordsList.every((word) => word.length > 2)).toBe(true);
  });
});

describe('kadenaCheckMnemonic', () => {
  it('should check if a mnemonic is valid', () => {
    const correctMnemonic = kadenaCheckMnemonic(MNEMONIC);
    expect(correctMnemonic).toBe(true);
  });
  it('should check if a mnemonic is invalid', () => {
    const WRONG_MNEMONIC =
      'mammal east oxygen romance wheel chimney frequent brain spawn owner announce';
    const wrongMnemonic = kadenaCheckMnemonic(WRONG_MNEMONIC);
    expect(wrongMnemonic).toBe(false);
  });
});

describe('kadenaMnemonicToRootKeypair', () => {
  it('should generate a Root key from mnemonic', async () => {
    const rootKey = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    expect(validateEncryptedValue(rootKey)).toBe(true);
  });

  it('should generate a the same root key from the same mnemonic', async () => {
    const rootKey1 = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    const rootKey2 = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);

    const rootKey1Decrypted = kadenaDecrypt(PASSWORD, rootKey1);
    const rootKey2Decrypted = kadenaDecrypt(PASSWORD, rootKey2);

    expect(rootKey1Decrypted).toEqual(rootKey2Decrypted);
  });

  it('should generate different root key for different mnemonic', async () => {
    const mnemonicSecond =
      'tuna nerve predict all catch early oblige inform hamster magnet century goddess';
    const rootKey1 = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    const rootKey2 = await kadenaMnemonicToRootKeypair(
      PASSWORD,
      mnemonicSecond,
    );

    const rootKey1Decrypted = kadenaDecrypt(PASSWORD, rootKey1);
    const rootKey2Decrypted = kadenaDecrypt(PASSWORD, rootKey2);

    expect(rootKey1Decrypted).not.toEqual(rootKey2Decrypted);
  });

  it('should generate different root key for different passwords same mnemonic', async () => {
    // Normally you would expect the same key from the same mnemonic regardless of password
    // But the rootKey value is encrypted with the password, so it will be different
    // yes, even after kadenaDecrypt - the legacy code encrypts as well
    const rootKey1 = await kadenaMnemonicToRootKeypair('pass-one', MNEMONIC);
    const rootKey2 = await kadenaMnemonicToRootKeypair('pass-two', MNEMONIC);

    const rootKey1Decrypted = kadenaDecrypt('pass-one', rootKey1);
    const rootKey2Decrypted = kadenaDecrypt('pass-two', rootKey2);

    expect(rootKey1Decrypted).not.toEqual(rootKey2Decrypted);
  });
});

describe('kadenaGenKeypair', () => {
  it('should generate keyPair from the rootKey', async () => {
    const rootKey = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    const { publicKey, secretKey } = await kadenaGenKeypair(
      PASSWORD,
      rootKey,
      1,
    );
    expect(validateEncryptedValue(secretKey)).toBe(true);

    const secretKeyDecrypted = kadenaDecrypt(PASSWORD, secretKey);

    expect(secretKeyDecrypted.length).toBe(128);
    expect(publicKey.length).toBe(64);

    const publicKeyFromSecret = getPublicKeyFromLegacySecretKey(secretKey);
    expect(publicKeyFromSecret).toEqual(publicKey);
  });

  it('should generate a range of keypairs from the rootKey', async () => {
    const rootKey = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    const keyPairs = await kadenaGenKeypair(PASSWORD, rootKey, [0, 3]);
    expect(keyPairs).toHaveLength(4);

    keyPairs.forEach(({ publicKey, secretKey }) => {
      expect(validateEncryptedValue(secretKey)).toBe(true);
      expect(publicKey.length).toBe(64);
    });
  });

  it('should generate a valid signature', async () => {
    const rootKey = await kadenaMnemonicToRootKeypair(PASSWORD, MNEMONIC);
    const signature = await kadenaSignFromRootKey(
      PASSWORD,
      'hello',
      rootKey,
      1,
    );

    expect(signature).toBeTruthy();
    expect(Buffer.from(signature).toString('hex')).toBe(
      '4a9a35634ca8b1efd0d84053bf73d78dda4e59223d230869ea7abbee8f923b723538f9a3ed13de31c8d629c97205a3becb15f5fdc71dc1dc4e42596b9a10d906',
    );
  });
});
