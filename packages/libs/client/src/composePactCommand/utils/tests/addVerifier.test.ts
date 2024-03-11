import { describe, expect, it } from 'vitest';
import { addVerifier } from '../addVerifier';

describe('addVerifier', () => {
  it('returns a verifier object', () => {
    expect(
      addVerifier<any>(
        { name: 'test-verifier', proof: 1.0 },
        (forCapability) => [forCapability('test.cap', 'a', 'b', 1)],
      )(),
    ).toEqual({
      verifiers: [
        {
          name: 'test-verifier',
          proof: 1.0,
          clist: [{ name: 'test.cap', args: ['a', 'b', 1] }],
        },
      ],
    });
  });

  it('returns a verifier object', () => {
    expect(
      addVerifier<any>(
        { name: 'test-verifier', proof: [{ item: '1' }] },
        (forCapability) => [forCapability('test.cap', 'a', 'b', 1)],
      )(),
    ).toEqual({
      verifiers: [
        {
          name: 'test-verifier',
          proof: [{ item: '1' }],
          clist: [{ name: 'test.cap', args: ['a', 'b', 1] }],
        },
      ],
    });
  });
});
