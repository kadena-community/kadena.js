import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { pointerSnapshot } from '../pointerSnapshot';

describe('pointerSnapshot parser', () => {
  it('should return the pointer snapshot value', () => {
    const pointer = getPointer('test string');
    pointer.next();
    const result = pointerSnapshot(pointer);
    expect(result).toBe(pointer.snapshot());
  });
});
