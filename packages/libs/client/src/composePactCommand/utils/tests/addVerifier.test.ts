import { describe, expect, it } from 'vitest';
import { addVerifier } from '../addVerifier';

describe('addVerifier', () => {
  it('returns a verifier object', () => {
    expect(
      addVerifier<any>(
        { name: 'test-verifier', proof: { decimal: '1.0' } },
        (forCapability) => [forCapability('test.cap', 'a', 'b', 1)],
      )(),
    ).toEqual({
      verifiers: [
        {
          name: 'test-verifier',
          proof: '1.0',
          clist: [{ name: 'test.cap', args: ['a', 'b', 1] }],
        },
      ],
    });
  });

  it('returns a verifier object', () => {
    const time = new Date(1710182720000);
    expect(
      addVerifier<any>(
        { name: 'test-verifier', proof: { item: '1', date: time } },
        (forCapability) => [forCapability('test.cap', 'a', 'b', 1)],
      )(),
    ).toEqual({
      verifiers: [
        {
          name: 'test-verifier',
          proof: '{"item": "1", "date": (time "2024-03-11T18:45:20Z")}',
          clist: [{ name: 'test.cap', args: ['a', 'b', 1] }],
        },
      ],
    });
  });
});
