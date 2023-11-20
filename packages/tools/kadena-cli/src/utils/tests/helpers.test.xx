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

describe('capitalizeFirstLetter', () => {
  it('should capitalize the first letter of a string', () => {
    const result = helpers.capitalizeFirstLetter('hello');
    expect(result).toBe('Hello');
  });

  it('should return an empty string if input is empty', () => {
    const result = helpers.capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  it('should return the same string if the first character is not a letter', () => {
    const result = helpers.capitalizeFirstLetter('1hello');
    expect(result).toBe('1hello');
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
    expect(helpers.isAlphanumeric('abc123')).toBe(true);
  });

  it('should return false for non-alphanumeric strings', () => {
    expect(helpers.isAlphanumeric('abc123!')).toBe(false);
    expect(helpers.isAlphanumeric(' ')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(helpers.isAlphanumeric('')).toBe(false);
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

describe('collectResponses', () => {
  it('should collect responses for a set of questions', async () => {
    const args = {};
    const questions = [
      { key: 'key1', prompt: () => Promise.resolve('Answer 1') },
      { key: 'key2', prompt: () => Promise.resolve('Answer 2') },
    ];
    const responses = await helpers.collectResponses(args, questions);
    expect(responses).toEqual({ key1: 'Answer 1', key2: 'Answer 2' });
  });

  it('should handle questions with default values', async () => {
    const args = {};
    const questions = [
      {
        key: 'key1',
        prompt: () => Promise.resolve('Answer 1'),
        default: 'Default 1',
      },
      {
        key: 'key2',
        prompt: () => Promise.resolve('Answer 2'),
        default: 'Default 2',
      },
    ];
    const responses = await helpers.collectResponses(args, questions);
    expect(responses).toEqual({ key1: 'Answer 1', key2: 'Answer 2' });
  });
});

describe('questionGenerator', () => {
  // it('should yield questions that are yet to be answered', () => {
  //   const args = { key1: 'value1' };
  //   const questions = [
  //     { key: 'key1', prompt: () => Promise.resolve('Answer 1') },
  //     { key: 'key2', prompt: () => Promise.resolve('Answer 2') },
  //   ];
  //   const generator = helpers.questionGenerator(args, questions);
  //   const result1 = generator.next();
  //   expect(result1.done).toBe(false);
  //   expect(result1.value.key).toBe('key2');
  //   const result2 = generator.next();
  //   expect(result2.done).toBe(true);
  // });
  // it('should generate all questions when args are empty', () => {
  //   const args = {};
  //   const questions = [
  //     { key: 'key1', prompt: () => Promise.resolve('Answer 1') },
  //     { key: 'key2', prompt: () => Promise.resolve('Answer 2') },
  //     { key: 'key3', prompt: () => Promise.resolve('Answer 3') },
  //   ];
  //   const generator = helpers.questionGenerator(args, questions);
  //   // First question should be 'key1'
  //   const result1 = generator.next();
  //   expect(result1.value).toEqual({
  //     key: 'key1',
  //     prompt: expect.any(Function),
  //   });
  //   expect(result1.done).toBe(false);
  //   // Simulate answering the first question
  //   args.key1 = 'Answer 1';
  //   // Second question should be 'key2'
  //   const result2 = generator.next();
  //   expect(result2.value).toEqual({
  //     key: 'key2',
  //     prompt: expect.any(Function),
  //   });
  //   expect(result2.done).toBe(false);
  //   // Simulate answering the second question
  //   args.key2 = 'Answer 2';
  //   // Third question should be 'key3'
  //   const result3 = generator.next();
  //   expect(result3.value).toEqual({
  //     key: 'key3',
  //     prompt: expect.any(Function),
  //   });
  //   expect(result3.done).toBe(false);
  //   // All questions have been answered, generator should be done
  //   const result4 = generator.next();
  //   expect(result4.value).toBeUndefined();
  //   expect(result4.done).toBe(true);
  // });
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
    const invalidAccount = 'k:invalid'; // Invalid length
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });

  it('should throw an error for an invalid account format (invalid characters)', () => {
    const invalidAccount = 'k:invalidaccount!@#$'; // Contains invalid characters
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
      'x:abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz01'; // Invalid prefix
    expect(() => helpers.getPubKeyFromAccount(invalidAccount)).toThrow(
      'Invalid account',
    );
  });
});

describe('getQuestionKeys', () => {
  it('should retrieve the keys of questions', () => {
    const questions = [
      { key: 'key1', prompt: () => Promise.resolve('Answer 1') },
      { key: 'key2', prompt: () => Promise.resolve('Answer 2') },
    ];
    const keys = helpers.getQuestionKeys(questions);
    expect(keys).toEqual(['key1', 'key2']);
  });
});
