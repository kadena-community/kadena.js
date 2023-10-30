import { describe, expect, it } from 'vitest';
import { pushUnique, trim } from '../utils';

describe('trim', () => {
  it('removes the presented character form the beginning and end of a string', () => {
    expect(trim('"string"', '"')).toBe('string');
  });
});

describe('pushUnique', () => {
  it('pushes item to the array if its unique', () => {
    const array = ['first'];
    pushUnique(array, 'second');
    expect(array).toEqual(['first', 'second']);
  });

  it('does not push item to the array if its duplicated', () => {
    const array = ['first'];
    pushUnique(array, 'first');
    expect(array).toEqual(['first']);
  });
});
