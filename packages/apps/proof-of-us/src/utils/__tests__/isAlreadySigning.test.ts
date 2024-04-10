import { describe, expect, test } from 'vitest';
import { isReadyToMint } from '../isAlreadySigning';

const createSigners = (
  count: number,
  startSignedCount: number,
  endSignedCount: number = 999999,
): IProofOfUsSignee[] => {
  const signers: IProofOfUsSignee[] = [];

  const shouldBeSigned = (idx: number) => {
    return idx >= startSignedCount && idx <= endSignedCount
      ? 'success'
      : 'init';
  };

  for (let i = 0; i < count; i++) {
    const signee = {
      accountName: `account ${i}`,
      alias: `alias ${i}`,
      initiator: i === 0,
      signerStatus: shouldBeSigned(i),
    } as unknown as IProofOfUsSignee;

    signers.push(signee);
  }

  return signers;
};

describe('utils isReadyToMint', () => {
  test('should be ready to sign if atleast 2/3 have signed, minus the intiator', async () => {
    // 51% has signed, but less than the minimum
    const result = isReadyToMint(createSigners(3, 1, 1)); //1 person signed
    expect(result).toEqual(false);

    const result2 = isReadyToMint(createSigners(3, 1)); // all, minus initiator signed
    expect(result2).toEqual(true);
  });

  test('should be ready to sign if atleast 3/4 have signed, minus the intiator', async () => {
    // 50% has signed, but less than the minimum
    const result = isReadyToMint(createSigners(4, 1, 2)); //2 signed
    expect(result).toEqual(false);

    const result2 = isReadyToMint(createSigners(3, 1)); // all, minus initiator signed
    expect(result2).toEqual(true);
  });
  test('should ready to sign if atleast 3/5 have signed, minus the intiator', async () => {
    const result = isReadyToMint(createSigners(5, 1, 2)); //3 signed
    expect(result).toEqual(false);

    const resul3 = isReadyToMint(createSigners(5, 1, 3)); //3 signed (+ initiator will make > 51%)
    expect(resul3).toEqual(true);

    const result2 = isReadyToMint(createSigners(5, 1)); // all, minus initiator signed
    expect(result2).toEqual(true);
  });
  test('should be ready to sign if atleast 3/6 have signed, minus the intiator', async () => {
    const result = isReadyToMint(createSigners(6, 1, 3)); //3 signed (+ initiator will make > 51%)
    expect(result).toEqual(true);
  });
  test('should be ready to sign if atleast 4/8 have signed, minus the intiator', async () => {
    const result = isReadyToMint(createSigners(8, 1, 4)); //4 signed
    expect(result).toEqual(true);

    const result2 = isReadyToMint(createSigners(8, 1, 3)); //4 signed
    expect(result2).toEqual(false);
  });
  test('should be ready to sign if atleast 1/2 have signed, minus the intiator', async () => {
    const result = isReadyToMint(createSigners(2, 1)); //1 signed
    expect(result).toEqual(true);
  });
  test('should never be ready to sign if only 1 user, minus the intiator', async () => {
    const result = isReadyToMint(createSigners(1, 0));
    expect(result).toEqual(false);
  });
});
