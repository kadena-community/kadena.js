jest.mock('isomorphic-fetch');

import type { SPVResponse } from '@kadena/types';

import { spv } from '../spv';

import { mockFetch } from './mockdata/mockFetch';
import { testSPVProof, testSPVRequest } from './mockdata/Pact';

import 'isomorphic-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/spv returns SPV proof', async () => {
  const actual: SPVResponse = await spv(testSPVRequest, '');
  const expected: SPVResponse = testSPVProof;
  expect(actual).toEqual(expected);
});

test('/spv returns error message when proof is young', () => {
  const actual: Promise<SPVResponse> = spv(testSPVRequest, '/tooyoung');
  const expectedErrorMsg =
    'SPV target not reachable: target chain not reachable. Chainweb instance is too young';
  return expect(actual).rejects.toThrowError(expectedErrorMsg);
});
