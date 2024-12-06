import { describe, expect, it } from 'vitest';
import { parsePactNumber } from '../pact.util';

describe('parsePactNumber', () => {
  it('should return the number when input is a number', () => {
    expect(parsePactNumber(42)).toBe(42);
    expect(parsePactNumber(-3.14)).toBe(-3.14);
    expect(parsePactNumber(0)).toBe(0);
  });

  it('should parse and return the decimal string as a float', () => {
    const input = { decimal: '123.456' };
    expect(parsePactNumber(input)).toBe(123.456);

    const negativeInput = { decimal: '-789.012' };
    expect(parsePactNumber(negativeInput)).toBe(-789.012);

    const zeroInput = { decimal: '0.0' };
    expect(parsePactNumber(zeroInput)).toBe(0.0);
  });

  it('should parse and return the int string as an integer', () => {
    const input = { int: '789' };
    expect(parsePactNumber(input)).toBe(789);

    const negativeInput = { int: '-456' };
    expect(parsePactNumber(negativeInput)).toBe(-456);

    const zeroInput = { int: '0' };
    expect(parsePactNumber(zeroInput)).toBe(0);
  });

  it('should throw an error when input is a plain string', () => {
    expect(() => parsePactNumber('123')).toThrow(
      'Failed to parse Pact number: "123"',
    );
    expect(() => parsePactNumber('abc')).toThrow(
      'Failed to parse Pact number: "abc"',
    );
  });

  it('should throw an error when object lacks both "decimal" and "int" properties', () => {
    const input = { other: 'value' };
    expect(() => parsePactNumber(input)).toThrow(
      'Failed to parse Pact number: "[object Object]"',
    );
  });

  it('should throw an error when "decimal" property is not a string', () => {
    const input = { decimal: 123.456 };
    expect(() => parsePactNumber(input)).toThrow(
      'Failed to parse Pact number: "[object Object]"',
    );
  });

  it('should throw an error when "int" property is not a string', () => {
    const input = { int: 789 };
    expect(() => parsePactNumber(input)).toThrow(
      'Failed to parse Pact number: "[object Object]"',
    );
  });

  it('should throw an error when input is undefined', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => parsePactNumber(undefined as any)).toThrow(
      'Failed to parse Pact number: "undefined"',
    );
  });

  it('should prioritize "decimal" over "int" when both are present', () => {
    const input = { decimal: '123.456', int: '789' };
    expect(parsePactNumber(input)).toBe(123.456);
  });

  it('should correctly parse large numbers', () => {
    const largeDecimal = { decimal: '1234567890.123456789' };
    expect(parsePactNumber(largeDecimal)).toBe(1234567890.123456789);

    const largeInt = { int: '9876543210' };
    expect(parsePactNumber(largeInt)).toBe(9876543210);
  });

  it('should parse valid numeric strings within objects and handle invalid formats appropriately', () => {
    const validDecimal = { decimal: '456.789' };
    expect(parsePactNumber(validDecimal)).toBe(456.789);

    const invalidDecimal = { decimal: '456.78.9' };
    const resultDecimal = parsePactNumber(invalidDecimal);
    expect(resultDecimal).toBe(456.78);

    const validInt = { int: '123' };
    expect(parsePactNumber(validInt)).toBe(123);

    const invalidInt = { int: '123abc' };
    expect(parsePactNumber(invalidInt)).toBe(123);
  });

  it('should throw an error when input is an empty object', () => {
    const input = {};
    expect(() => parsePactNumber(input)).toThrow(
      'Failed to parse Pact number: "[object Object]"',
    );
  });

  it('should correctly parse when object has additional properties', () => {
    const inputDecimal = { decimal: '321.654', extra: 'data' };
    expect(parsePactNumber(inputDecimal)).toBe(321.654);

    const inputInt = { int: '654', extra: 123 };
    expect(parsePactNumber(inputInt)).toBe(654);
  });
});
