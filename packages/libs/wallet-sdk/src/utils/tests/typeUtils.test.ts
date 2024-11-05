import { describe, expect, it } from 'vitest';
import { notEmpty } from '../typeUtils';

describe('notEmpty function', () => {
  it('returns true for non-null and non-undefined values', () => {
    expect(notEmpty(0)).toBe(true);
    expect(notEmpty('')).toBe(true);
    expect(notEmpty('hello')).toBe(true);
    expect(notEmpty([])).toBe(true);
    expect(notEmpty([1, 2, 3])).toBe(true);
    expect(notEmpty({})).toBe(true);
    expect(notEmpty({ key: 'value' })).toBe(true);
  });

  it('returns false for null and undefined values', () => {
    expect(notEmpty(null)).toBe(false);
    expect(notEmpty(undefined)).toBe(false);
  });
});
