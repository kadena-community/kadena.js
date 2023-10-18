jest.mock('cross-fetch');
import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';
import type { SPVResponse } from '../interfaces/PactAPI';
import { spv } from '../spv';
import { testSPVProof, testSPVRequest, testURL } from './mockdata/Pact';
import { mockFetch } from './mockdata/mockFetch';

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
