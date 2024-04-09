import { describe, expect, it } from 'vitest';
import { literal, readKeyset, unpackLiterals } from '../pact-helpers';

describe('readKeyset', () => {
  it('returns read-keyset string', () => {
    expect(readKeyset('ks')()).toBe('(read-keyset "ks")');
  });
});

describe('literal', () => {
  it('returns a function that returns the input', () => {
    expect(literal('free.contract').getValue()).toBe('free.contract');
  });
  it('returns a function that returns the input', () => {
    expect(literal('free.contract').toJSON()).toBe('Literal(free.contract)');
  });

  it('returns a function that returns the input', () => {
    expect(literal('free.contract').toString()).toBe('free.contract');
  });
});

describe('unpackLiterals', () => {
  it('returns a function that returns the input', () => {
    expect(unpackLiterals('["Literal(free.contract)", "Literal(coin)"]')).toBe(
      '[free.contract, coin]',
    );
  });
});
