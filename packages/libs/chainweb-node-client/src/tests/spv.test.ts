import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import type { SPVResponse } from '../interfaces/PactAPI';
import { spv } from '../spv';
import { testSPVProof, testSPVRequest, testURL } from './mockdata/Pact';

const httpHandlers = [
  http.post(`${testURL}/spv`, () => new HttpResponse(testSPVProof)),
  http.post(
    `${testURL}/tooyoung/spv`,
    () =>
      new HttpResponse(
        'SPV target not reachable: target chain not reachable. Chainweb instance is too young',
        { status: 400 },
      ),
    { once: true },
  ),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

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
