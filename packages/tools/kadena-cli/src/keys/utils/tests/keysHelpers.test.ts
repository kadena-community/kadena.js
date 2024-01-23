import { describe, expect, it } from 'vitest';
import { extractStartIndex, parseKeyIndexOrRange } from '../keysHelpers.js';

describe('parseKeyIndexOrRange', () => {
  it('parses a single number correctly', () => {
    expect(parseKeyIndexOrRange('5')).toBe(5);
  });
  it('parses a range separated by hyphen correctly', () => {
    expect(parseKeyIndexOrRange('1-10')).toEqual([1, 10]);
  });
  it('parses a range separated by comma correctly', () => {
    expect(parseKeyIndexOrRange('1,10')).toEqual([1, 10]);
  });
  it('throws error on invalid single number format', () => {
    expect(() => parseKeyIndexOrRange('abc')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
  });
  it('throws error on invalid range format', () => {
    expect(() => parseKeyIndexOrRange('1-abc')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
    expect(() => parseKeyIndexOrRange('abc-10')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
  });
  it('parses a range with space-padding correctly', () => {
    expect(parseKeyIndexOrRange('  3 - 7  ')).toEqual([3, 7]);
    expect(parseKeyIndexOrRange('3  ,   7')).toEqual([3, 7]);
  });
  it('throws error on invalid format with non-numeric characters', () => {
    expect(() => parseKeyIndexOrRange('3a')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
    expect(() => parseKeyIndexOrRange('5_10')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
  });
  it('throws error on incomplete range format', () => {
    expect(() => parseKeyIndexOrRange('4-')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
    expect(() => parseKeyIndexOrRange('-5')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
    expect(() => parseKeyIndexOrRange('3,')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
    expect(() => parseKeyIndexOrRange(',6')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
  });
  it('throws error on range with negative numbers', () => {
    expect(() => parseKeyIndexOrRange('-1-3')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
    expect(() => parseKeyIndexOrRange('3--2')).toThrow(
      'Invalid range format. Expected format: "start-end" or "start, end" e.g "1-10" or "1,10".',
    );
  });
  it('throws error on non-integer values', () => {
    expect(() => parseKeyIndexOrRange('3.5')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
    expect(() => parseKeyIndexOrRange('1.2-2.4')).toThrow(
      'Invalid number input. e.g "1" or "1-10" or "1,10"',
    );
  });
  it('throws error when passing a number directly', () => {
    const five = 5 as unknown as string; // typescript for testing
    const ten = 10 as unknown as string; // typescript for testing
    expect(() => parseKeyIndexOrRange(five)).toThrow();
    expect(() => parseKeyIndexOrRange(ten)).toThrow();
  });
  it('throws error when passing a number in a range directly', () => {
    const oneToFive = [1, 5] as unknown as string; // typescript for testing
    expect(() => parseKeyIndexOrRange(oneToFive)).toThrow();
  });
});

describe('extractStartIndex', () => {
  it('should return the number itself if a single number is provided', () => {
    expect(extractStartIndex(5)).toBe(5);
  });

  it('should return the first element of the tuple if a range is provided', () => {
    expect(extractStartIndex([3, 7])).toBe(3);
  });

  // New test cases for fault tolerance
  it('should throw an error for non-numeric single inputs', () => {
    expect(() => extractStartIndex('invalid' as unknown as number)).toThrow();
  });

  it('should throw an error for tuples not containing exactly two numbers', () => {
    expect(() =>
      extractStartIndex([1] as unknown as [number, number]),
    ).toThrow();
    expect(() =>
      extractStartIndex([1, 2, 3] as unknown as [number, number]),
    ).toThrow();
    expect(() =>
      extractStartIndex(['a', 'b'] as unknown as [number, number]),
    ).toThrow();
  });

  it('should throw an error for non-array and non-number inputs', () => {
    expect(() =>
      extractStartIndex({} as unknown as [number, number]),
    ).toThrow();
    expect(() => extractStartIndex(null as unknown as number)).toThrow();
    expect(() => extractStartIndex(undefined as unknown as number)).toThrow();
  });
});
