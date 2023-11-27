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
    const encryptedMessage = kadenaEncrypt(password, message);
    const decryptedMessage = kadenaDecrypt(password, encryptedMessage);
    expect(Buffer.from(decryptedMessage).toString('utf-8')).toEqual(
      message.toString('utf-8'),
    );
    expect(message.toJSON()).not.toBe(encryptedMessage);
    expect(encryptedMessage.toString()).not.toBe(decryptedMessage.toString());
  });

  it('should throw an error when the incorrect password is provided', async () => {
    const correctPassword = 'correct-password';
    const wrongPassword = 'wrong-password';
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(correctPassword, message);
    expect(() => {
      kadenaDecrypt(wrongPassword, encryptedMessage);
    }).toThrow('Decryption failed');
  });

  it('should throw an error if the encrypted key is corrupted', () => {
    const password = 'test-password';
    const corruptedEncryptedPrivateKey = 'corrupted-data' as EncryptedString;

    expect(() => {
      kadenaDecrypt(password, corruptedEncryptedPrivateKey);
    }).toThrow();
  });

  it('should throw an error if the encrypted data is empty', () => {
    const password = 'test-password';
    const emptyEncryptedMessage = '' as EncryptedString;

    expect(() => {
      kadenaDecrypt(password, emptyEncryptedMessage);
    }).toThrow('Encrypted data is empty');
  });

  it('should handle passwords with special characters', async () => {
    const specialCharPassword = 'p@ssw0rd!#%&';
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(specialCharPassword, message);
    expect(
      kadenaDecrypt(specialCharPassword, encryptedMessage).toString(),
    ).toBe(message.toString());
  });

  it('should handle extremely long passwords', async () => {
    const longPassword = 'p'.repeat(1000);
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(longPassword, message);
    expect(kadenaDecrypt(longPassword, encryptedMessage).toString()).toBe(
      message.toString(),
    );
  });

  it('should handle unicode characters in passwords', async () => {
    const unicodePassword = '密码'; // 'password' in Chinese
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(unicodePassword, message);

    expect(kadenaDecrypt(unicodePassword, encryptedMessage).toString()).toBe(
      message.toString(),
    );
  });
});

describe('kadenaChangePassword', () => {
  const privateKey = Uint8Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 256),
  );
  const password = 'currentPassword123';
  const newPassword = 'newPassword123';

  it('changes the password successfully and allows decryption with the new password', () => {
    const firstPassword = 'firstPassword123';
    const secondPassword = 'secondPassword123';
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(firstPassword, message);
    const newEncryptedMessage = kadenaChangePassword(
      firstPassword,
      encryptedMessage,
      secondPassword,
    );
    expect(encryptedMessage.toString()).not.toBe(
      newEncryptedMessage.toString(),
    );

    const decryptedMessage = Buffer.from(
      kadenaDecrypt(secondPassword, newEncryptedMessage),
    );
    expect(decryptedMessage.toString()).toBe(message.toString());
  });

  it('throws an error when the password is incorrect', () => {
    const encryptedPrivateKey = kadenaEncrypt(password, privateKey);
    const incorrectPassword = 'wrongPassword';
    const changePasswordAttempt = () =>
      kadenaChangePassword(incorrectPassword, encryptedPrivateKey, newPassword);

    expect(changePasswordAttempt).toThrow(
      'Failed to decrypt the private key with the old password: Decryption failed',
    );
  });

  it('fails to decrypt with the old password after the password has been changed', () => {
    const firstPassword = 'firstPassword123';
    const secondPassword = 'secondPassword123';
    const message = Buffer.from('test-message');
    const encryptedMessage = kadenaEncrypt(firstPassword, message);
    const newEncryptedMessage = kadenaChangePassword(
      firstPassword,
      encryptedMessage,
      secondPassword,
    );
    expect(() => kadenaDecrypt(firstPassword, newEncryptedMessage)).toThrow();
  });

  const testUndefined = undefined as unknown as EncryptedString;
  const testNull = null as unknown as EncryptedString;
  const testUnint8Array = Uint8Array.from({
    length: 32,
  }) as unknown as EncryptedString;
  const testMessage = 'test-message' as EncryptedString;

  it('handles non-string inputs for private keys and passwords', () => {
    expect(() =>
      kadenaChangePassword(password, testUndefined, newPassword),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(testUndefined, testMessage, newPassword),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(password, testMessage, testUndefined),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(password, testNull, newPassword),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(testNull, testUnint8Array, newPassword),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(password, testMessage, testNull),
    ).toThrow();
    expect(() =>
      kadenaChangePassword(password, testMessage, password),
    ).toThrow();
  });
});
