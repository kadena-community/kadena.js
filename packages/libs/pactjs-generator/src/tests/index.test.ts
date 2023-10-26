import { describe, expect, it } from 'vitest';
import * as crypto from '../index';

describe('MyLib', () => {
  it('should have exports', () => {
    expect(typeof crypto).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(crypto).forEach((exportKey) =>
      expect(Boolean((crypto as Record<string, unknown>)[exportKey])).toBe(
        true,
      ),
    );
  });
});
