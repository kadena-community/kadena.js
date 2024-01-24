import { describe, expect, it } from 'vitest';
import { stripAccountPrefix } from '../string';

describe('stripAccountPrefix', () => {
  it('should be able strip the k: prefix from an account name', () => {
    expect(stripAccountPrefix('k:123abc')).toBe('123abc');
    expect(stripAccountPrefix(' k:123abc')).toBe('123abc');
    expect(stripAccountPrefix('k:123abc ')).toBe('123abc');
    expect(stripAccountPrefix(' k:123abc ')).toBe('123abc');
    expect(stripAccountPrefix('K:123abc')).toBe('123abc');
    expect(stripAccountPrefix('123abc')).toBe('123abc');
    expect(stripAccountPrefix(' 123abc  ')).toBe('123abc');
    expect(stripAccountPrefix('c:123abc')).toBe('c:123abc');
    expect(stripAccountPrefix(' c:123abc ')).toBe('c:123abc');
    expect(stripAccountPrefix('w:123abc:keys-any')).toBe('w:123abc:keys-any');
  });
});
