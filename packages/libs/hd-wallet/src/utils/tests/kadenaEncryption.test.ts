import { describe, expect, it } from 'vitest';

import type { EncryptedString } from '../kadenaEncryption.js';
import {
  kadenaChangePassword,
  kadenaDecrypt,
  kadenaEncrypt,
} from '../kadenaEncryption.js';

describe('kadenaDecrypt', () => {
  it('should correctly decrypt a previously encrypted string', async () => {
    const password = 'test-password';
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(password, message);
    const decryptedMessage = await kadenaDecrypt(password, encryptedMessage);
    expect(Buffer.from(decryptedMessage).toString('utf-8')).toEqual(
      message.toString('utf-8'),
    );
    expect(message.toString()).not.toBe(encryptedMessage);
    expect(encryptedMessage).not.toBe(Buffer.from(decryptedMessage).toString());
  });

  it('should throw an error when the incorrect password is provided', async () => {
    const correctPassword = 'correct-password';
    const wrongPassword = 'wrong-password';
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(correctPassword, message);
    await expect(() =>
      kadenaDecrypt(wrongPassword, encryptedMessage),
    ).rejects.toThrow('Decryption failed');
  });

  it('should throw an error if the encrypted key is corrupted', async () => {
    const password = 'test-password';
    const corruptedEncryptedPrivateKey = 'corrupted-data' as EncryptedString;

    await expect(() =>
      kadenaDecrypt(password, corruptedEncryptedPrivateKey),
    ).rejects.toThrow();
  });

  it('should throw an error if the encrypted data is empty', async () => {
    const password = 'test-password';
    const emptyEncryptedMessage = '' as EncryptedString;

    await expect(() =>
      kadenaDecrypt(password, emptyEncryptedMessage),
    ).rejects.toThrow('Encrypted data is empty');
  });

  it('should handle passwords with special characters', async () => {
    const specialCharPassword = 'p@ssw0rd!#%&';
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(specialCharPassword, message);
    const decryptedMessage = await kadenaDecrypt(
      specialCharPassword,
      encryptedMessage,
    );
    expect(Buffer.from(decryptedMessage).toString()).toBe(message.toString());
  });

  it('should handle extremely long passwords', async () => {
    const longPassword = 'p'.repeat(1000);
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(longPassword, message);
    const decryptedMessage = await kadenaDecrypt(
      longPassword,
      encryptedMessage,
    );
    expect(Buffer.from(decryptedMessage).toString()).toBe(message.toString());
  });

  it('should handle unicode characters in passwords', async () => {
    const unicodePassword = '密码'; // 'password' in Chinese
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(unicodePassword, message);
    const decryptedMessage = await kadenaDecrypt(
      unicodePassword,
      encryptedMessage,
    );

    expect(Buffer.from(decryptedMessage).toString()).toBe(message.toString());
  });
});

describe('kadenaChangePassword', () => {
  const privateKey = Uint8Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256),
  );
  const password = 'currentPassword123';
  const newPassword = 'newPassword123';

  it('changes the password successfully and allows decryption with the new password', async () => {
    const firstPassword = 'firstPassword123';
    const secondPassword = 'secondPassword123';
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(firstPassword, message);
    const newEncryptedMessage = await kadenaChangePassword(
      firstPassword,
      encryptedMessage,
      secondPassword,
    );
    expect(encryptedMessage.toString()).not.toBe(
      newEncryptedMessage.toString(),
    );

    const decryptedMessage = Buffer.from(
      await kadenaDecrypt(secondPassword, newEncryptedMessage),
    );

    expect(decryptedMessage.toString()).toBe(message.toString());
  });

  it('throws an error when the password is incorrect', async () => {
    const encryptedPrivateKey = await kadenaEncrypt(password, privateKey);
    const incorrectPassword = 'wrongPassword';
    const changePasswordAttempt = () =>
      kadenaChangePassword(incorrectPassword, encryptedPrivateKey, newPassword);

    await expect(() => changePasswordAttempt()).rejects.toThrow(
      'Failed to decrypt the private key with the old password: Decryption failed',
    );
  });

  it('Should decrypt legacy messages', async () => {
    const value = 'test-message';
    const password = 'test-password';
    // This encrypted message was generated with the legacy code
    // using 1000 iterations and without storing the iterations in the encrypted string.
    // It is important that we can still decrypt these old messages.
    const encryptedMessage =
      'ZFBsTGsyUG16QXY1dk5PUEIrVHM2dz09Lm5OUDZ1UEVZZmJjMTRnMUIuYnJHdDBqZERxbW55SVEydjA3UlpMRlJDeUN4WjlPa05qN2pZR0E9PQ==';
    const decryptedMessage = await kadenaDecrypt(password, encryptedMessage);
    expect(Buffer.from(decryptedMessage).toString('utf-8')).toEqual(value);
  });

  it('fails to decrypt with the old password after the password has been changed', async () => {
    const firstPassword = 'firstPassword123';
    const secondPassword = 'secondPassword123';
    const message = Buffer.from('test-message');
    const encryptedMessage = await kadenaEncrypt(firstPassword, message);
    const newEncryptedMessage = await kadenaChangePassword(
      firstPassword,
      encryptedMessage,
      secondPassword,
    );
    await expect(() =>
      kadenaDecrypt(firstPassword, newEncryptedMessage),
    ).rejects.toThrow();
  });

  const testUndefined = undefined as unknown as EncryptedString;
  const testNull = null as unknown as EncryptedString;
  const testUnint8Array = Uint8Array.from({
    length: 32,
  }) as unknown as EncryptedString;
  const testMessage = 'test-message' as EncryptedString;

  it('handles non-string inputs for private keys and passwords', async () => {
    await expect(() =>
      kadenaChangePassword(password, testUndefined, newPassword),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(testUndefined, testMessage, newPassword),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(password, testMessage, testUndefined),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(password, testNull, newPassword),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(testNull, testUnint8Array, newPassword),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(password, testMessage, testNull),
    ).rejects.toThrow();
    await expect(() =>
      kadenaChangePassword(password, testMessage, password),
    ).rejects.toThrow();
  });
});
