import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { IPollRequestBody, IPollResponse } from '../interfaces/PactAPI';
import { poll } from '../poll';
import { localCommandResult } from './mockdata/execCommand';
import { testURL } from './mockdata/Pact';

const httpHandlers = [
  http.post(
    `${testURL}/api/v1/poll`,
    () =>
      HttpResponse.json({
        pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: localCommandResult,
      }),
    { once: true },
  ),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('/poll should return request keys of txs submitted', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand: IPollRequestBody = {
    requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
  };

  const commandResult: IPollResponse = {
    pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: localCommandResult,
  };
  const localReq: IPollRequestBody = signedCommand;
  const responseExpected: IPollResponse = commandResult;
  const responseActual: Response | IPollResponse = await poll(
    localReq,
    testURL,
  );

  expect(responseExpected).toEqual(responseActual);
});
