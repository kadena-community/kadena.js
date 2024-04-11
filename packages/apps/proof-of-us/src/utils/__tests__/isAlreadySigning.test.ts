import { describe, expect, test } from 'vitest';
import {
  getAllowedSigners,
  isReadyToMint,
  isReadyToSign,
} from '../isAlreadySigning';
import { createSigners } from './testutils/createSigners';

describe('utils getAllowedSigners', () => {
  test('should filter out all signers that are not allowed to sign', () => {
    const signees = createSigners({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const result = getAllowedSigners(signees);
    expect(result.length).toBe(5);
  });
});

describe('utils isReadyToMint', () => {
  test('should be ready to sign if atleast 2/3 have signed, minus the intiator', async () => {
    // 51% has signed, but less than the minimum
    const result = isReadyToMint(
      createSigners({ count: 3, startSignedCount: 1, endSignedCount: 1 }),
    ); //1 person signed
    expect(result).toEqual(false);

    const result2 = isReadyToMint(
      createSigners({ count: 3, startSignedCount: 1 }),
    ); // all, minus initiator signed
    expect(result2).toEqual(true);
  });

  test('should be ready to sign if atleast 3/4 have signed, minus the intiator', async () => {
    // 50% has signed, but less than the minimum
    const result = isReadyToMint(
      createSigners({ count: 4, startSignedCount: 1, endSignedCount: 2 }),
    ); //2 signed
    expect(result).toEqual(false);

    const result2 = isReadyToMint(
      createSigners({ count: 3, startSignedCount: 1 }),
    ); // all, minus initiator signed
    expect(result2).toEqual(true);
  });
  test('should ready to sign if atleast 3/5 have signed, minus the intiator', async () => {
    const result = isReadyToMint(
      createSigners({ count: 5, startSignedCount: 1, endSignedCount: 2 }),
    ); //3 signed
    expect(result).toEqual(false);

    const resul3 = isReadyToMint(
      createSigners({ count: 5, startSignedCount: 1, endSignedCount: 3 }),
    ); //3 signed (+ initiator will make > 51%)
    expect(resul3).toEqual(true);

    const result2 = isReadyToMint(
      createSigners({ count: 5, startSignedCount: 1 }),
    ); // all, minus initiator signed
    expect(result2).toEqual(true);
  });
  test('should be ready to sign if atleast 3/6 have signed, minus the intiator', async () => {
    const result = isReadyToMint(
      createSigners({ count: 6, startSignedCount: 1, endSignedCount: 3 }),
    ); //3 signed (+ initiator will make > 51%)
    expect(result).toEqual(true);
  });
  test('should be ready to sign if atleast 4/8 have signed, minus the intiator', async () => {
    const result = isReadyToMint(
      createSigners({ count: 8, startSignedCount: 1, endSignedCount: 4 }),
    ); //4 signed
    expect(result).toEqual(true);

    const result2 = isReadyToMint(
      createSigners({ count: 8, startSignedCount: 1, endSignedCount: 3 }),
    ); //4 signed
    expect(result2).toEqual(false);
  });
  test('should be ready to sign if atleast 1/2 have signed, minus the intiator', async () => {
    const result = isReadyToMint(
      createSigners({ count: 2, startSignedCount: 1 }),
    ); //1 signed
    expect(result).toEqual(true);
  });
  test('should never be ready to sign if only 1 user, minus the intiator', async () => {
    const result = isReadyToMint(
      createSigners({ count: 1, startSignedCount: 0 }),
    );
    expect(result).toEqual(false);
  });
});
describe('utils isReadyToSign', () => {
  test('should not be ready to sign if 2/3 are allowed', async () => {
    // 51% has signed, but less than the minimum
    const result = isReadyToSign(
      createSigners({
        count: 3,
        startSignedCount: 1,
        startNotAllowedCount: 1,
        endNotAllowedCount: 1,
      }),
    ); //1 person not allowed
    expect(result).toEqual(false);
  });

  test('should not be ready to sign if 3/4 are allowed', async () => {
    // 50% has signed, but less than the minimum
    const result = isReadyToSign(
      createSigners({
        count: 4,
        startSignedCount: 1,
        startNotAllowedCount: 3,
        endNotAllowedCount: 3,
      }),
    ); //2 signed
    expect(result).toEqual(false);
  });
  test('should not ready to sign if atleast 3/5 are allowed', async () => {
    const result = isReadyToSign(
      createSigners({
        count: 5,
        startSignedCount: 1,
        startNotAllowedCount: 3,
        endNotAllowedCount: 4,
      }),
    ); // signed
    expect(result).toEqual(false);
  });

  test('should  ready to sign if  4/5 are allowed', async () => {
    const result = isReadyToSign(
      createSigners({
        count: 5,
        startSignedCount: 1,
        startNotAllowedCount: 4,
        endNotAllowedCount: 4,
      }),
    ); // signed
    expect(result).toEqual(true);
  });

  test('should be ready to sign if atleast 4/6 are allowed', async () => {
    const result = isReadyToSign(
      createSigners({
        count: 6,
        startSignedCount: 1,
        startNotAllowedCount: 4,
        endNotAllowedCount: 5,
      }),
    ); //3 signed (+ initiator will make > 51%)
    expect(result).toEqual(true);
  });
  test('should be ready to sign if 5/8 are allowed', async () => {
    const result = isReadyToSign(
      createSigners({
        count: 8,
        startSignedCount: 1,
        endSignedCount: 4,
        startNotAllowedCount: 5,
      }),
    ); //4 signed
    expect(result).toEqual(true);
  });
});
