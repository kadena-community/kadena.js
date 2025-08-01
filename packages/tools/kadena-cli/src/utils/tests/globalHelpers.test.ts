import { describe, expect, it } from 'vitest';
import { templatePartialSchema } from '../../commands/tx/commands/templates/mapper.js';
import * as globalHelpers from '../globalHelpers.js';

describe('safeAssign', () => {
  it('should assign value to object if value is not undefined or empty string', () => {
    const obj = { key: 'original' };
    globalHelpers.safeAssign(obj, 'key', 'new value');
    expect(obj.key).toBe('new value');
  });

  it('should not assign value if it is undefined', () => {
    const obj = { key: 'original' };
    globalHelpers.safeAssign(obj, 'key', undefined);
    expect(obj.key).toBe('original');
  });

  it('should not assign value if it is an empty string', () => {
    const obj = { key: 'original' };
    globalHelpers.safeAssign(obj, 'key', '');
    expect(obj.key).toBe('original');
  });
});

describe('isAlphabetic', () => {
  it('should return true for alphabetic strings', () => {
    expect(globalHelpers.isAlphabetic('HelloWorld')).toBe(true);
  });

  it('should return false for non-alphabetic strings', () => {
    expect(globalHelpers.isAlphabetic('123ABC')).toBe(false);
    expect(globalHelpers.isAlphabetic('Hello World!')).toBe(false);
  });
});

describe('isNumeric', () => {
  it('should return true for numeric strings', () => {
    expect(globalHelpers.isNumeric('12345')).toBe(true);
  });

  it('should return false for non-numeric strings', () => {
    expect(globalHelpers.isNumeric('abc')).toBe(false);
    expect(globalHelpers.isNumeric('123abc')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(globalHelpers.isNumeric('')).toBe(false);
  });
});

describe('isAlphanumeric', () => {
  it('should return true for alphanumeric strings', () => {
    expect(globalHelpers.isValidFilename('abc123')).toBe(true);
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
    filenames.map((name) =>
      expect(globalHelpers.isValidFilename(name)).toBe(false),
    );
  });

  it('should return false for empty string', () => {
    expect(globalHelpers.isValidFilename('')).toBe(false);
  });
});

describe('mergeConfigs', () => {
  it('should merge properties from source into target', () => {
    const target = { key1: 'value1', key2: 'value2' };
    const source = { key1: 'newvalue1', key3: 'value3' };
    const merged = globalHelpers.mergeConfigs(target, source);
    expect(merged).toEqual({ key1: 'newvalue1', key2: 'value2' });
  });
});

describe('getPubKeyFromAccount', () => {
  it('should extract the public key from a valid account string (k prefix)', () => {
    const validAccount =
      'k:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = globalHelpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (c prefix)', () => {
    const validAccount =
      'c:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = globalHelpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (t prefix)', () => {
    const validAccount =
      't:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = globalHelpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (w prefix)', () => {
    const validAccount =
      'w:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = globalHelpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should extract the public key from a valid account string (u prefix)', () => {
    const validAccount =
      'u:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    const pubKey = globalHelpers.getPubKeyFromAccount(validAccount);
    expect(pubKey).toBe(
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01',
    );
  });

  it('should throw an error for an invalid account format (length < 66)', () => {
    const invalidAccount = 'k:invalid';
    expect(() => globalHelpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (invalid characters)', () => {
    const invalidAccount = 'k:invalidaccount!@#$';
    expect(() => globalHelpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (missing prefix)', () => {
    const invalidAccount =
      'abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    expect(() => globalHelpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (invalid prefix)', () => {
    const invalidAccount =
      'x:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01';
    expect(() => globalHelpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });
});

describe('formatZodError with templatePartialSchema', () => {
  it('should format missing required fields', () => {
    // Missing both meta and publicMeta, and missing payload
    const input = {
      signers: [],
    };

    const result = templatePartialSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (result.error) {
      const formatted = globalHelpers.formatZodError(result.error);
      expect(formatted).toContain('payload');
      expect(formatted).toContain('Required');
    } else {
      expect(result.error).toBeDefined();
    }
  });

  it('should format nested errors in payload.exec', () => {
    const input = {
      payload: {
        exec: {
          code: 123, // should be string
        },
      },
      signers: [],
      meta: {
        sender: 'sender',
        chainId: '0',
      },
    };

    const result = templatePartialSchema.safeParse(input);
    expect(result.success).toBe(false);

    if (result.error) {
      const formatted = globalHelpers.formatZodError(result.error);
      expect(formatted).toContain('payload.exec.code');
      expect(formatted).toContain('Expected string');
    } else {
      expect(result.error).toBeDefined();
    }
  });

  it('should format nested errors in payload.exec.code not presented', () => {
    const input = {
      payload: {
        exec: {},
      },
      signers: [],
      meta: {
        sender: 'sender',
        chainId: '0',
      },
    };

    const result = templatePartialSchema.safeParse(input);
    expect(result.success).toBe(false);

    if (result.error) {
      const formatted = globalHelpers.formatZodError(result.error);
      expect(formatted).toContain('payload.exec.code');
      expect(formatted).toContain('Required');
    } else {
      expect(result.error).toBeDefined();
    }
  });

  it('should format error if signer pubKey is missing', () => {
    const input = {
      payload: {
        exec: {
          code: '(some code)',
        },
      },
      signers: [
        {
          clist: [
            {
              name: 'foo',
              args: [],
            },
          ],
        },
      ],
      meta: {
        sender: 'sender',
        chainId: '0',
      },
    };

    const result = templatePartialSchema.safeParse(input);
    expect(result.success).toBe(false);
    if (result.error) {
      const formatted = globalHelpers.formatZodError(result.error);
      expect(formatted).toContain('signers.0');
      expect(formatted).toContain('Invalid input');
    } else {
      expect(result.error).toBeDefined();
    }
  });

  it('should handle completely empty input gracefully', () => {
    const result = templatePartialSchema.safeParse({});
    expect(result.success).toBe(false);
    if (result.error) {
      const formatted = globalHelpers.formatZodError(result.error);
      expect(formatted).toContain('payload');
      expect(formatted).toContain('signers');
    } else {
      expect(result.error).toBeDefined();
    }
  });
});
