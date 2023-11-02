import { describe, expect, it } from 'vitest';
import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { block } from '../block';
import { id } from '../id';
import { FAILED } from '../rule';
import { seq } from '../seq';
import { skipTheRest } from '../skip';

describe('asString parser', () => {
  it('should return result as string if rule is matched', () => {
    const pointer = getPointer('name : John');
    const parser = asString(seq(id('name'), id(':'), skipTheRest), ' ');
    expect(parser(pointer)).toBe('name : John');
  });

  it('should concatenate the tokens by join string/char', () => {
    const pointer = getPointer('(name    :    John)');
    const parser = asString(block(id('name'), id(':'), skipTheRest), '-');
    expect(parser(pointer)).toBe('(-name-:-John-)');
  });

  it('should return FAILED if rule is not satisfied', () => {
    const pointer = getPointer('age : 24');
    const parser = asString(seq(id('name'), id(':'), skipTheRest));
    expect(parser(pointer)).toBe(FAILED);
  });
});
