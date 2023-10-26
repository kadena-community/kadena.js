import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { ids } from '../ids';
import { FAILED } from '../rule';

describe('ids parser', () => {
  it('should return a string value if token value is the same as one of the presented inputs', () => {
    const pointer = getPointer('test');
    const result = ids(['test', 'ok'])(pointer);
    expect(result).toBe('test');
  });

  it('should return FAILED if the token value is not the same as none of the inputs', () => {
    const pointer = getPointer('one item');
    const result = ids(['ok', 'test'])(pointer);
    expect(result).toBe(FAILED);
  });

  it('should use the mapper function to map the token to the expected value', () => {
    const pointer = getPointer('test');
    const result = ids(
      ['test', 'ok'],
      (idx, list) => list[idx].length,
    )(pointer);
    expect(result).toBe(4);
  });
});
