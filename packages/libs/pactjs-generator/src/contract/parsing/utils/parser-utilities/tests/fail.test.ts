import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { fail } from '../fail';
import { FAILED } from '../rule';

describe('fail parser', () => {
  it('always returns FAILED', () => {
    const pointer = getPointer('test');
    const result = fail(pointer);
    expect(result).toBe(FAILED);
  });
});
