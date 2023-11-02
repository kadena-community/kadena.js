import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { id } from '../id';
import { FAILED } from '../rule';

describe('id parser', () => {
  it('should return a string value if token value is the same as arg', () => {
    const pointer = getPointer('test');
    const result = id('test')(pointer);
    expect(result).toBe('test');
  });

  it('should return FAILED if the token value is not the same as input', () => {
    const pointer = getPointer('test');
    const result = id('ok')(pointer);
    expect(result).toBe(FAILED);
  });

  it('should return the second argument if presented and token Value is matched', () => {
    const pointer = getPointer('test');
    const result = id('test', true)(pointer);
    expect(result).toBe(true);
  });
});
