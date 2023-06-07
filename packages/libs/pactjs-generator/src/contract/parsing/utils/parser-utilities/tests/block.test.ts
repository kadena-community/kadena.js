import { getPointer } from '../../getPointer';
import { asString } from '../asString';
import { block } from '../block';
import { id } from '../id';
import { FAILED } from '../rule';

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
});
