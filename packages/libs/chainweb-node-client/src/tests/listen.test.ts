jest.mock('cross-fetch');

import type {
  ICommandResult,
  IListenRequestBody,
  ListenResponse,
} from '../interfaces/PactAPI';
import { listen } from '../listen';

import { mockFetch } from './mockdata/mockFetch';
import { testURL } from './mockdata/Pact';

import type { Response } from 'cross-fetch';
import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/listen should return result of tx queried', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const requestKey: IListenRequestBody = {
    listen: 'ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q',
  };

  const commandResult1: ListenResponse = {
    reqKey: 'pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik',
    txId: null,
    result: {
      data: 3,
      status: 'success',
    },
    gas: 0,
    continuation: null,
    metaData: null,
    logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
  };
  const localReq: IListenRequestBody = requestKey;
  const responseExpected: ListenResponse = commandResult1;
  const responseActual: ICommandResult | Response = await listen(
    localReq,
    testURL,
  );

  expect(responseExpected).toEqual(responseActual);
});
