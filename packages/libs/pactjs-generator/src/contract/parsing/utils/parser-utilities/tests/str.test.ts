import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { FAILED } from '../rule';
import { str } from '../str';

describe('str parser', () => {
  it('should return a string ("text")  value if token type is string', () => {
    const pointer = getPointer('"str_test"');
    const result = str(pointer);
    // quotation marks are removed
    expect(result).toBe('str_test');
  });

  it("should return a string ('text) value if token type is symbol", () => {
    const pointer = getPointer("'str_test");
    const result = str(pointer);
    // quotation marks are removed
    expect(result).toBe('str_test');
  });

  it('should return FAILED if token type is not string', () => {
    const pointer = getPointer('test');
    const result = str(pointer);
    expect(result).toBe(FAILED);
  });
});
