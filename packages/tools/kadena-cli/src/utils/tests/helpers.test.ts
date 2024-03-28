import { describe, expect, it } from 'vitest';
import * as helpers from '../helpers.js';

describe('safeAssign', () => {
  it('should assign value to object if value is not undefined or empty string', () => {
    const obj = { key: 'original' };
    helpers.safeAssign(obj, 'key', 'new value');
    expect(obj.key).toBe('new value');
  });

  it('should not assign value if it is undefined', () => {
    const obj = { key: 'original' };
    helpers.safeAssign(obj, 'key', undefined);
    expect(obj.key).toBe('original');
  });

  it('should not assign value if it is an empty string', () => {
    const obj = { key: 'original' };
    helpers.safeAssign(obj, 'key', '');
    expect(obj.key).toBe('original');
  });
});

describe('isAlphabetic', () => {
  it('should return true for alphabetic strings', () => {
    expect(helpers.isAlphabetic('HelloWorld')).toBe(true);
  });

  it('should return false for non-alphabetic strings', () => {
    expect(helpers.isAlphabetic('123ABC')).toBe(false);
    expect(helpers.isAlphabetic('Hello World!')).toBe(false);
  });
});

describe('isNumeric', () => {
  it('should return true for numeric strings', () => {
    expect(helpers.isNumeric('12345')).toBe(true);
  });

  it('should return false for non-numeric strings', () => {
    expect(helpers.isNumeric('abc')).toBe(false);
    expect(helpers.isNumeric('123abc')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(helpers.isNumeric('')).toBe(false);
  });
});

describe('isAlphanumeric', () => {
  it('should return true for alphanumeric strings', () => {
    expect(helpers.isValidFilename('abc123')).toBe(true);
  });

  it('returns false for invalid filenames', () => {
    const filenames = [
      '',
      ' ',
      'test<file.txt',
      'test>file.txt',
      'test:file.txt',
      'test"file.txt',
      'test/file.txt',
      'test\\file.txt',
      'test|file.txt',
      'test?file.txt',
      'test*file.txt',
    ];
    filenames.map((name) => expect(helpers.isValidFilename(name)).toBe(false));
  });

  it('should return false for empty string', () => {
    expect(helpers.isValidFilename('')).toBe(false);
  });
});

describe('mergeConfigs', () => {
  it('should merge properties from source into target', () => {
    const target = { key1: 'value1', key2: 'value2' };
    const source = { key1: 'newvalue1', key3: 'value3' };
    const merged = helpers.mergeConfigs(target, source);
    expect(merged).toEqual({ key1: 'newvalue1', key2: 'value2' });
  });
});

describe('getPubKeyFromAccount', () => {
  it('should extract the public key from a valid account string (k prefix)', () => {
    const validAccount =
      'k:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = helpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (c prefix)', () => {
    const validAccount =
      'c:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = helpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (t prefix)', () => {
    const validAccount =
      't:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = helpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (w prefix)', () => {
    const validAccount =
      'w:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = helpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (u prefix)', () => {
    const validAccount =
      'u:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = helpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should throw an error for an invalid account format (length < 66)', () => {
    const invalidAccount = 'k:invalid';
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (invalid characters)', () => {
    const invalidAccount = 'k:invalidaccount!@#$';
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (missing prefix)', () => {
    const invalidAccount =
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (invalid prefix)', () => {
    const invalidAccount =
      'x:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });
});
