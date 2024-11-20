import { describe, expect, it } from 'vitest';
import { mergeOptions } from '../mergeOptions';

describe('mergeOptions', () => {
  it('should merge options', () => {
    const options: Record<string, number> = { a: 1, b: 2 };
    const newOptions: Record<string, number> = { b: 3, c: 4 };
    const mergedOptions = mergeOptions(options, newOptions);
    expect(mergedOptions).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('should merge arrays', () => {
    const options: Record<string, number | [number]> = { a: 1, b: [2] };
    const newOptions: Record<string, number | [number]> = { b: [3], c: 4 };
    const mergedOptions = mergeOptions(options, newOptions);
    expect(mergedOptions).toEqual({ a: 1, b: [2, 3], c: 4 });
  });

  it('should merge object sub properties', () => {
    const options: Record<string, any> = { a: 1, b: 2, c: { one: 'one' } };
    const newOptions: Record<string, any> = { b: [3], c: { second: 'second' } };
    const mergedOptions = mergeOptions(options, newOptions);
    expect(mergedOptions).toEqual({
      a: 1,
      b: [2, 3],
      c: {
        one: 'one',
        second: 'second',
      },
    });
  });
  it('returns the second object if the first object is undefined', () => {
    const options: Record<string, number> = { a: 1, b: 2 };
    const mergedOptions = mergeOptions(undefined, options);
    expect(mergedOptions).toEqual({ a: 1, b: 2 });
  });
  it('returns the first object if the second object is undefined', () => {
    const options: Record<string, number> = { a: 1, b: 2 };
    const mergedOptions = mergeOptions(options, undefined);
    expect(mergedOptions).toEqual({ a: 1, b: 2 });
  });
});
