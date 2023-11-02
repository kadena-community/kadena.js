import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import type {
  ICommandResult,
  IListenRequestBody,
  ListenResponse,
} from '../interfaces/PactAPI';
import { listen } from '../listen';
import { localCommandResult } from './mockdata/execCommand';
import { testURL } from './mockdata/Pact';

const httpHandlers = [
  http.post(
    `${testURL}/api/v1/listen`,
    () => HttpResponse.json(localCommandResult),
    { once: true },
  ),
];

const server = setupServer(...httpHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('/listen should return result of tx queried', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const requestKey: IListenRequestBody = {
    listen: 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
  };

  const commandResult1: ListenResponse = localCommandResult;
  const localReq: IListenRequestBody = requestKey;
  const responseExpected: ListenResponse = commandResult1;
  const responseActual: ICommandResult | Response = await listen(
    localReq,
    testURL,
  );

  expect(responseExpected).toEqual(responseActual);
});
