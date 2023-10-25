import { rest } from 'msw';
import { setupServer } from 'msw/node';
import type { IPollRequestBody, IPollResponse } from '../interfaces/PactAPI';
import { poll } from '../poll';
import { testURL } from './mockdata/Pact';

const restHandlers = [
  rest.post(`${testURL}/api/v1/poll`, (req, res, ctx) => {
    return res.once(
      ctx.status(200),
      ctx.json({
        pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: {
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
        },
      }),
    );
  }),
];

const server = setupServer(...restHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('/poll should return request keys of txs submitted', async () => {
  // A tx created for chain 0 of devnet using `pact -a`.
  const signedCommand: IPollRequestBody = {
    requestKeys: ['ATGCYPMNzdGcFh9Iik73KfMkgURIxaF91Ze4sHFsH8Q'],
  };

  const commandResult: IPollResponse = {
    pMohh9G2NT1jQn4byK1iwvoLopbnU86NeNPSUq8I0ik: {
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
    },
  };
  const localReq: IPollRequestBody = signedCommand;
  const responseExpected: IPollResponse = commandResult;
  const responseActual: Response | IPollResponse = await poll(
    localReq,
    testURL,
  );

  expect(responseExpected).toEqual(responseActual);
});
