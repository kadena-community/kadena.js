import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { atom } from '../atom';
import { id } from '../id';
import { $ } from '../inspect';
import { repeat } from '../repeat';
import { FAILED } from '../rule';
import { seq } from '../seq';
import { str } from '../str';

describe('repeat parser', () => {
  it('should check all of the tokens available via the pointer if the rule matches any of the presented rules.', () => {
    const pointer = getPointer('some "test" word');
    const result = asString(repeat(atom, str), ' ')(pointer);
    expect(result).toBe('some "test" word');
    expect(pointer.done()).toBe(true);
  });

  it('should return wrappedData object', () => {
    const pointer = getPointer('this is test');
    const result = repeat(atom)(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(typeof result).toBe('object');
    expect(result.inspect).toBe(true);
  });

  it('should return wrapped value with empty object as data if token does not match any of the rules', () => {
    const pointer = getPointer('not matched with rules');
    const result = repeat(
      seq(id('first'), id('rule')),
      seq(id('second'), id('rule')),
    )(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(0);
  });

  it('should return wrapped value with object as data that has a key for each inspected value in the child rules', () => {
    const pointer = getPointer(
      'name: alice title: developer name:bob title: manager',
    );
    const result = repeat(
      $('names', seq(id('name'), id(':'), $(atom))),
      $('titles', seq(id('title'), id(':'), $(atom))),
    )(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(2);
    expect(result.data.names).toEqual(['alice', 'bob']);
    expect(result.data.titles).toEqual(['developer', 'manager']);
  });
});
