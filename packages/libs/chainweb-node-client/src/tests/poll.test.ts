import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, beforeAll, expect, test } from 'vitest';
import type { IPollRequestBody, IPollResponse } from '../interfaces/PactAPI';
import { poll } from '../poll';
import { localCommandResult } from './mockdata/execCommand';
import { testURL } from './mockdata/Pact';

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());

test('/poll should return request keys of txs submitted', async () => {
  server.resetHandlers(
    http.post(
      `${testURL}/api/v1/poll`,
      () =>
        HttpResponse.json({
          pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: localCommandResult,
        }),
      { once: true },
    ),
  );
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

test("confirmationsDepth should be added to the url's searchParams", async () => {
  server.resetHandlers(
    http.post(
      `${testURL}/api/v1/poll?confirmationDepth=5`,
      () =>
        HttpResponse.json({
          pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: localCommandResult,
        }),
      { once: true },
    ),
  );
  const signedCommand: IPollRequestBody = {
    requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
  };

  const commandResult: IPollResponse = {
    pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: localCommandResult,
  };
  const responseExpected: IPollResponse = commandResult;
  const localReq: IPollRequestBody = signedCommand;

  const responseActual: Response | IPollResponse = await poll(
    localReq,
    testURL,
    5,
  );

  expect(responseExpected).toEqual(responseActual);
});
