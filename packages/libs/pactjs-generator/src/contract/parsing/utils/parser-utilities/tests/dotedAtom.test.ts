import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { dotedAtom } from '../dotedAtom';
import { FAILED } from '../rule';

describe('dotedAtom parser', () => {
  it('should return a string value if its has a format like one.two.three', () => {
    const pointer = getPointer('one.two.three');
    const result = dotedAtom(pointer);
    expect(result).toBe('one.two.three');
  });

  it('should return FAILED if the string is not matched', () => {
    let pointer = getPointer('one');
    let result = dotedAtom(pointer);
    expect(result).toBe(FAILED);

    pointer = getPointer('one.two.');
    result = dotedAtom(pointer);
    expect(result).toBe(FAILED);
  });
});
