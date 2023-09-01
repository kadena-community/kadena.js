jest.mock('cross-fetch');

import type { SPVResponse } from '../interfaces/PactAPI';
import { spv } from '../spv';

import { mockFetch } from './mockdata/mockFetch';
import { testSPVProof, testSPVRequest, testURL } from './mockdata/Pact';

import fetch, { type Response } from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/spv returns SPV proof', async () => {
  const actual: string | Response = await spv(testSPVRequest, testURL);
  const expected: SPVResponse = testSPVProof;
  expect(actual).toEqual(expected);
});

test('/spv returns error message when proof is young', () => {
  const actual: Promise<string | Response> = spv(
    testSPVRequest,
    `${testURL}/tooyoung`,
  );
  const expectedErrorMsg =
    'SPV target not reachable: target chain not reachable. Chainweb instance is too young';
  return expect(actual).rejects.toThrowError(expectedErrorMsg);
});
