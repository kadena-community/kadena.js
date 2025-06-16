import { describe, expect, it } from 'vitest';
import { shortenString } from './shortenString';

describe('shortenString', () => {
  it('returns the original string if shorter than the limit', () => {
    expect(shortenString('short', 10)).toBe('short');
  });

  it('returns the original string if equal to the limit', () => {
    expect(shortenString('12345', 5)).toBe('12345');
  });

  it('shortens and adds ellipsis if longer than the limit', () => {
    expect(shortenString('abcdefghijklmnopqrstuvwxyz', 10)).toBe('abcdefg...');
  });

  it('defaults to length 20 if not provided', () => {
    expect(shortenString('1234567890123456789012345')).toBe(
      '12345678901234567...',
    );
  });

  it('handles empty string', () => {
    expect(shortenString('', 5)).toBe('');
  });
});
