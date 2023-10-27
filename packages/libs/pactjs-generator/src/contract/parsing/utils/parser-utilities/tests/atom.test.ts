import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { atom } from '../atom';
import { FAILED } from '../rule';

describe('atom parser', () => {
  it('should return a atom value if token type is atom', () => {
    const pointer = getPointer('atomName');
    const result = atom(pointer);
    expect(result).toBe('atomName');
  });

  it('should return FAILED if token type is not atom, (e.g. string or keywords)', () => {
    const pointer = getPointer('module');
    const result = atom(pointer);
    expect(result).toBe(FAILED);
  });
});
