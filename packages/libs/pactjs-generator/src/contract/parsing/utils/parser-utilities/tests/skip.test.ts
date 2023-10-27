import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { atom } from '../atom';
import { $ } from '../inspect';
import { FAILED } from '../rule';
import { seq } from '../seq';
import { skipTheRest, skipToken } from '../skip';

describe('skipTheRest parser', () => {
  it('should skip all of the tokens an pointer.done() should returns true after that', () => {
    const pointer = getPointer('just some test input');
    const result = skipTheRest(pointer);
    // quotation marks are removed
    expect(pointer.done()).toBe(true);
    expect(result).not.toBe(FAILED);
  });
});

describe('skipToken parser', () => {
  it('should skip only one token', () => {
    const pointer = getPointer('first second');
    const result = seq(skipToken, $('secondToken', atom))(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(result.data.secondToken).toBe('second');
  });
});
