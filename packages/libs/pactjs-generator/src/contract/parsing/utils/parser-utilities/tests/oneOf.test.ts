import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { id } from '../id';
import { oneOf } from '../oneOf';
import { FAILED } from '../rule';
import { seq } from '../seq';

describe('oneOf parser', () => {
  it('should return the result of the first rule that matches with tokens', () => {
    const pointer = getPointer('some test word');
    const result = oneOf(
      // the second one is more specific but because it has lower priority the first one matched the input
      asString(seq(id('some'), id('test')), ' '),
      asString(seq(id('some'), id('test'), id('word')), ' '),
    )(pointer);
    expect(result).toBe('some test');
  });

  it('should return FAILED if none of the rules satisfy the input', () => {
    const pointer = getPointer('not matched with rules');
    const result = oneOf(
      seq(id('first'), id('rule')),
      seq(id('second'), id('rule')),
    )(pointer);
    expect(result).toBe(FAILED);
  });
});
