import { describe, expect, it } from 'vitest';
import { hasField, isIPactDecimal, isIPactInt, isObject } from '../type-guards';

describe('isObject', () => {
  it('returns true for object', () => {
    expect(isObject({})).toBe(true);
  });
  it('returns false for null', () => {
    expect(isObject(null)).toBe(false);
  });
  it('returns false for non-object types', () => {
    [1, 'hello', true, undefined, Symbol('test')].forEach((item) =>
      expect(isObject(item)).toBe(false),
    );
  });
});

describe('hasField', () => {
  it('returns true if object has the filed', () => {
    expect(hasField({ test: '1' }, 'test')).toBe(true);
  });
  it('returns false if object does not has the filed', () => {
    expect(hasField({ one: '1' }, 'two')).toBe(false);
  });
});

describe('isIPactDecimal', () => {
  it('returns true for IPactDecimal', () => {
    expect(isIPactDecimal({ decimal: '1' })).toBe(true);
  });
  it('returns false for non-IPactDecimal', () => {
    expect(isIPactDecimal({ int: '1' })).toBe(false);
  });
});

describe('isIPactInt', () => {
  it('returns true for IPactInt', () => {
    expect(isIPactInt({ int: '1' })).toBe(true);
  });
  it('returns false for non-IPactInt', () => {
    expect(isIPactInt({ decimal: '1' })).toBe(false);
  });
});
