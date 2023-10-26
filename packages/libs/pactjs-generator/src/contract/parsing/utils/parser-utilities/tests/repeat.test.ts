import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { atom } from '../atom';
import { id } from '../id';
import { $ } from '../inspect';
import { repeat } from '../repeat';
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
    expect(typeof result).toBe('object');
    expect(result.inspect).toBe(true);
  });

  it('should return wrapped value with empty object as data if token does not match any of the rules', () => {
    const pointer = getPointer('not matched with rules');
    const result = repeat(
      seq(id('first'), id('rule')),
      seq(id('second'), id('rule')),
    )(pointer);
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
    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(2);
    expect(result.data.names).toEqual(['alice', 'bob']);
    expect(result.data.titles).toEqual(['developer', 'manager']);
  });

  it('should merge objects as a list if the keys are same', () => {
    const pointer = getPointer(
      'name: alice title: developer name:bob title: manager',
    );
    const result = repeat(
      seq(id('name'), id(':'), $('name', atom)),
      seq(id('title'), id(':'), $('title', atom)),
    )(pointer);

    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(2);
    expect(result.data.name).toEqual(['alice', 'bob']);
    expect(result.data.title).toEqual(['developer', 'manager']);
  });

  it('should return not-categorized key id the inspected item does not have a name', () => {
    const pointer = getPointer('name: alice name:bob');
    const result = repeat(seq(id('name'), id(':'), $(atom)))(pointer);
    expect(typeof result.data).toBe('object');
    expect(Object.keys(result.data)).toHaveLength(1);
    // TODO: check if we need to add typing for this path or change it to something else
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.data as any)['not-categorized']).toEqual(['alice', 'bob']);
  });
});
