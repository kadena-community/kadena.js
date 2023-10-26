import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { id } from '../id';
import { maybe } from '../maybe';

describe('maybe parser', () => {
  it('should return the parser result if its not FAILED', () => {
    const pointer = getPointer('test');
    const result = maybe(id('test'))(pointer);
    expect(result).toBe('test');
  });

  it('should return undefined if the parser fails', () => {
    const pointer = getPointer('test');
    const result = maybe(id('ok'))(pointer);
    expect(result).toBe(undefined);
  });
});
