import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { retrieveContractFromChain } from '../retrieveContractFromChain';

const restHandlers = [
  rest.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact/api/v1/local',
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({ result: { data: { code: 'some pactCode' } } }),
      );
    },
  ),
];

const server = setupServer(...restHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('retrieveContractFromChain', () => {
  it('returns the pactCode on success', async () => {
    const result = await retrieveContractFromChain(
      'free.crankk01',
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      0,
      'mainnet',
    );

    expect(result).toBe('some pactCode');
  });
});
