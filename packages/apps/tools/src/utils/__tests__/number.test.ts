import { describe, expect, it, test } from 'vitest';
import { formatNumberAsString } from '../number';

describe('formatNumberAsString', () => {
  test('formating the number as a string with 12 fraction digits', () => {
    const value = 1234.123456789098;
    const result = formatNumberAsString(value);
    expect(result).toBe('1234.123456789098');
  });

  it('formating zero as a string with one fraction digit', () => {
    const value = 0;
    const result = formatNumberAsString(value);
    expect(result).toBe('0.0');
  });

  it('formating zero with 9 fraction digits as a string ', () => {
    const value = 0.000000001;
    const result = formatNumberAsString(value);
    expect(result).toBe('0.000000001');
  });
});
