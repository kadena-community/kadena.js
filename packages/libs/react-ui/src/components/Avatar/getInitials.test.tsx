import { describe, expect, test } from 'vitest';
import { getInitials } from './getInitials';

describe('getInitials', () => {
  test('returns the initials for 2 names', () => {
    const initials = getInitials('Mafi Rulis');
    expect(initials).toBe('MR');
  });

  test('returns the initials only for 2 names', () => {
    const initials = getInitials('Sam Ferrero Rocher');
    expect(initials).toBe('SF');
  });

  test('returns first 2 letters if not last name', () => {
    const initials = getInitials('Sam');
    expect(initials).toBe('SA');
  });

  test('returns first letter for short inputs', () => {
    const initials = getInitials('S');
    expect(initials).toBe('S');
  });
});
