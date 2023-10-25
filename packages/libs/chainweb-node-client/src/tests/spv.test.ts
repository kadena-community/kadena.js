import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { SPVResponse } from '../interfaces/PactAPI';
import { spv } from '../spv';
import { testSPVProof, testSPVRequest, testURL } from './mockdata/Pact';

const restHandlers = [
  rest.post(`${testURL}/spv`, (req, res, ctx) => {
    return res.once(ctx.status(200), ctx.text(testSPVProof));
  }),
  rest.post(`${testURL}/tooyoung/spv`, (req, res, ctx) => {
    return res.once(
      ctx.status(400),
      ctx.text(
        'SPV target not reachable: target chain not reachable. Chainweb instance is too young',
      ),
    );
  }),
];

const server = setupServer(...restHandlers);

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
