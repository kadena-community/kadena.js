import { rest } from 'msw';
import { setupServer } from 'msw/node';
import chainweb from '..';
import { config } from './config';
import { blockByHeightBranchPageMock } from './mocks/blockByHeightBranchPageMock';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { header } from './mocks/header';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/* ************************************************************************** */
/* Test settings */

const debug: boolean = false;

/* ************************************************************************** */
/* Test Utils */

const logg = (...args: unknown[]): void => {
  if (debug) {
    console.log(...args);
  }
};

/* ************************************************************************** */
/* Headers */

const height = 1511601;

/* ************************************************************************** */
/* By Height */

describe('chainweb.header', () => {
  it('should return the correct header by height', async () => {
    server.resetHandlers(
      rest.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        (req, res, ctx) =>
          res.once(ctx.status(200), ctx.json(blockByHeightCurrentCutMock)),
      ),
      rest.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        (req, res, ctx) =>
          res.once(ctx.status(200), ctx.json(blockByHeightBranchPageMock)),
      ),
    );

    const r = await chainweb.header.height(
      0,
      height,
      config.network,
      config.host,
    );
    logg('Headers:', r);
    expect(r).toEqual(header);
  });
});
