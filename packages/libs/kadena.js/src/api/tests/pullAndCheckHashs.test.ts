import { expect, test } from 'vitest';
import { pullAndCheckHashs } from '../pullAndCheckHashs';
import { signature as signature1 } from './mockdata/contCommand';
import { signature } from './mockdata/execCommand';

test('Takes in an array of signature objects and check that all signatures signed the same hash, and outputs the hash', () => {
  const actual = pullAndCheckHashs([signature]);
  const expected = 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik';

  expect(expected).toEqual(actual);
});

test('Takes in an array of signature objects and throw error when signatures signed different hash', () => {
  expect(() => pullAndCheckHashs([signature, signature1])).toThrow();
});
