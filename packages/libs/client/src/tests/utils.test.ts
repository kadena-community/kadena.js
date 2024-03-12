import { describe, expect, it } from 'vitest';
import { parseAsPactValue } from '../utils/parseAsPactValue'; // Replace with the actual module path

describe('parseType', () => {
  it('returns the decimal value when input is a PactLiteral object with decimal property', () => {
    const arg = { decimal: '10' };
    const result = parseAsPactValue(arg);
    expect(result).toBe('10.0');
  });

  it('returns the integer value when input is a PactLiteral object with int property', () => {
    const arg = { int: '5' };
    const result = parseAsPactValue(arg);
    expect(result).toBe('5');
  });

  it('returns the input argument if it is neither an object, number, string, nor function', () => {
    const arg = true;
    const result = parseAsPactValue(arg);
    expect(result).toBe('true');
  });

  it('wraps string input in double quotes', () => {
    const arg = 'hello';
    const result = parseAsPactValue(arg);
    expect(result).toBe('"hello"');
  });

  it('invokes the function and return its result', () => {
    const arg = (): string => 'dynamic';
    const result = parseAsPactValue(arg);
    expect(result).toBe('dynamic');
  });

  it('throws an error if input is a number', () => {
    const arg = 42;
    expect(() => {
      parseAsPactValue(arg);
    }).toThrow('Type `number` is not allowed');
  });
});
