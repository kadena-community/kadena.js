import { describe, expect, test } from 'vitest';
import { convertSignersObjectToArray } from '../convertSignersObjectToArray';
import { createSigners, createSignersObject } from './testutils/createSigners';

describe('utils convertSignersObjectToArray', () => {
  test('should return empty array if object is undefined or null', () => {
    const result = convertSignersObjectToArray();
    expect(result).toEqual([]);
  });
  test('should return all objects in an array', () => {
    const signees = createSignersObject({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const signeesArray = createSigners({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const result = convertSignersObjectToArray(signees);
    expect(result).toEqual(signeesArray);
  });
  test('should return all objects in an array, initiator should always be first record', () => {
    const signees = createSignersObject({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const { account0, ...newSignees } = signees;

    const result = convertSignersObjectToArray(signees);
    const result2 = convertSignersObjectToArray({ ...newSignees, account0 });
    expect(result2).toEqual(result);
  });
  test('should return all objects in an array, ordered alphabatical (accountname)', () => {
    const signees = createSignersObject({
      count: 8,
      startSignedCount: 0,
      startNotAllowedCount: 3,
      endNotAllowedCount: 5,
    });

    const {
      account1,
      account2,
      account3,
      account4,
      account5,
      account6,
      account7,
      account0,
    } = signees;
    const result = convertSignersObjectToArray(signees);
    const result2 = convertSignersObjectToArray({
      account2,
      account4,
      account0,
      account1,
      account7,
      account5,
      account3,
      account6,
    });

    expect(result2).toEqual(result);
  });
});
