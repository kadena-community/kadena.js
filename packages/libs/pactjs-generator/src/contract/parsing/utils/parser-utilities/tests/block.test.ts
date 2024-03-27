import { describe, expect, it } from 'vitest';
import { unwrapData } from '../../dataWrapper';
import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { atom } from '../atom';
import { block, restrictedBlock } from '../block';
import { id } from '../id';
import { $ } from '../inspect';
import { FAILED } from '../rule';
import { seq } from '../seq';

describe('block rule', () => {
  it('should match with ( ...anything )', () => {
    const pointer = getPointer('( test )');
    const result = asString(block(id('test')), ' ')(pointer);
    expect(result).toBe('( test )');
  });

  it('should return FAILED if the parentheses are not matched like ((anything) ', () => {
    const pointer = getPointer('(( test )');
    const result = block(id('test'))(pointer);
    expect(result).toBe(FAILED);
  });

  it('should skip the rest of the tokens in the block if all rules are already matched', () => {
    const pointer = getPointer('( this ( is not important ) )');
    const result = asString(block(id('this')), ' ')(pointer);
    expect(result).toBe('( this ( is not important ) )');
  });

  it('should return wrapped value with object as data that has a key for each inspected value in the child rules', () => {
    const pointer = getPointer('(name: alice title: developer)');
    const result = block(
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

describe('restrictedBlock rule', () => {
  it('should return FAILED if the parentheses are not matched like ((anything) ', () => {
    const pointer = getPointer('(( test )');
    const result = restrictedBlock(id('test'))(pointer);
    expect(result).toBe(FAILED);
  });

  it('does not skip the rest of the tokens in the block if all rules are already matched', () => {
    const pointer = getPointer('( this should fail )');
    const result = unwrapData(restrictedBlock($('test', id('this')))(pointer));
    expect(result).toBe(FAILED);
  });
});
