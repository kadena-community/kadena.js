import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { FAILED, rule } from '../rule';

describe('rule parser', () => {
  it("should return the parser's return value. If the parsing process is successful", () => {
    const pointer = getPointer('atomName');
    const testParser = rule((pointer) => {
      const token = pointer.next();
      return token?.value;
    });
    const result = testParser(pointer);
    expect(result).toBe('atomName');
  });

  it('should return the FAILED. If the parsing process fails', () => {
    const pointer = getPointer('module');
    const testParser = rule((pointer) => {
      pointer.next();
      return FAILED;
    });
    const result = testParser(pointer);
    expect(result).toBe(FAILED);
  });

  it('it should reset the pointer. If the parsing process fails', () => {
    const pointer = getPointer('just some test data');
    const initial = pointer.snapshot();
    const testParser = rule((pointer) => {
      pointer.next();
      return FAILED;
    });
    const result = testParser(pointer);
    expect(result).toBe(FAILED);
    expect(pointer.snapshot()).toBe(initial);
  });
});
