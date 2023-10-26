import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { id } from '../id';
import { $ } from '../inspect';
import { FAILED } from '../rule';

describe('inspect parser', () => {
  it('should return a wrapped object with data and name', () => {
    const pointer = getPointer('test');
    const result = $('a-name', id('test'))(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
    } else {
      expect(result.name).toBe('a-name');
      expect(result.data).toBe('test');
    }
  });

  it('should return FAILED if the parser returns FAILED', () => {
    const pointer = getPointer('test');
    const result = $('a-name', id('ok'))(pointer);
    expect(result).toBe(FAILED);
  });

  it('should return a wrapped object with undefined name if the name is not presented', () => {
    const pointer = getPointer('test');
    const result = $(id('test'))(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
    } else {
      expect(result.name).toBe(undefined);
      expect(result.data).toBe('test');
    }
  });
});
