jest.mock('cross-fetch');

import { ICommandResult } from '@kadena/types';

import fetch, { Response } from 'cross-fetch';

import type { IListenRequestBody, ListenResponse } from '@kadena/types';

import { listen } from '../listen';

import { mockFetch } from './mockdata/mockFetch';

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
    reqKey: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
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
  const responseActual: ICommandResult | Response = await listen(localReq, '');

  expect(responseExpected).toEqual(responseActual);
});
