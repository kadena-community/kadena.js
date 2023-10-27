import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { atom } from '../atom';
import { id } from '../id';
import { $ } from '../inspect';
import { FAILED } from '../rule';
import { seq } from '../seq';

describe('seq rule', () => {
  it('should return FAILED if rule does not match the input', () => {
    const pointer = getPointer('name: bob');
    const result = seq(id('name'), id('-'), atom)(pointer);
    expect(result).toBe(FAILED);
  });

  it('should return wrapped value if the rule matches input', () => {
    const pointer = getPointer('name: bob');
    const result = seq(id('name'), id(':'), atom)(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(result.inspect).toBe(true);
  });

  it('should return wrapped value with object as data that has a key for each inspected value in the child rules', () => {
    const pointer = getPointer('name: alice title: developer');
    const result = seq(
      $('name', seq(id('name'), id(':'), $(atom))),
      $('title', seq(id('title'), id(':'), $(atom))),
    )(pointer);
    if (result === FAILED) {
      expect(result).not.toBe(FAILED);
      return;
    }
    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(2);
    expect(result.data.name).toBe('alice');
    expect(result.data.title).toBe('developer');
  });
});
