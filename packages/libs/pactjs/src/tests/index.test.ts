import { describe, expect, it } from 'vitest';
import * as thisModule from '../index';

describe('MyLib', () => {
  it('should have exports', () => {
    expect(typeof thisModule).toBe('object');
  });

  it('should not have undefined exports', () => {
    Object.keys(thisModule).forEach((exportKey) =>
      expect(Boolean((thisModule as Record<string, unknown>)[exportKey])).toBe(
        true,
      ),
    );
  });
});
