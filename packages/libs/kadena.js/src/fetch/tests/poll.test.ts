jest.mock('node-fetch');

import type { IPollRequestBody, IPollResponse } from '@kadena/types';

import { poll } from '../poll';

import { mockFetch } from './mockdata/mockFetch';

import fetch from 'node-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

test('/poll should return request keys of txs submitted', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand: IPollRequestBody = {
    requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
  };

  const commandResult: IPollResponse = {
    'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8': {
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
    },
  };
  const localReq: IPollRequestBody = signedCommand;
  const responseExpected: IPollResponse = commandResult;
  const responseActual: IPollResponse = await poll(localReq, '');

  expect(responseExpected).toEqual(responseActual);
});
