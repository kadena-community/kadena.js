import { expect, test } from 'vitest';
import { unique } from '../unique';

test('Takes in an array of hashes and remove duplicate', () => {
  const cmdHashes = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  ];

  const actual = unique(cmdHashes);
  const expected = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  ];

  expect(expected).toEqual(actual);
});

test('Takes in an array of unique hashes and return unique hashes', () => {
  const cmdHashes = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  ];

  const actual = unique(cmdHashes);
  const expected = [
    'NjduEShgzrjEmAVhprS85hst7mvCqOo6qjGH5j5WHro',
    'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
  ];

  expect(expected).toEqual(actual);
});
