import { rest } from 'msw';
import { setupServer } from 'msw/node';
import chainweb from '..';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { cutPeersMock } from './mocks/cutPeers';

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
/* Cuts */

describe('chainweb.cut', () => {
  /* ************************************************************************** */
  /* By Peers */

  it('gets p2p cuts of network and validates', async () => {
    server.resetHandlers(
      rest.get(
        'https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer',
        (req, res, ctx) => res.once(ctx.status(200), ctx.json(cutPeersMock)),
      ),
    );

    const r = await chainweb.cut.peers(
      'mainnet01',
      'https://us-e1.chainweb.com',
    );
    logg('Cut Peers:', r);
    expect(r).toBeTruthy();
    expect(r.length).toBeGreaterThan(0);
  });

  /* ************************************************************************** */
  /* By Current */

  it('gets current cut from chainweb node', async () => {
    server.resetHandlers(
      rest.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        (req, res, ctx) =>
          res.once(ctx.status(200), ctx.json(blockByHeightCurrentCutMock)),
      ),
    );

    const r = await chainweb.cut.current(
      'mainnet01',
      'https://api.chainweb.com',
    );
    logg('Current Cut:', r);
    expect(r).toBeTruthy();
    expect(r).toHaveProperty('instance');
    expect(r).toHaveProperty('height');
    expect(r).toHaveProperty('weight');
    expect(r).toHaveProperty('hashes');
    expect(Object.keys(r.hashes).length).toBe(20);
    expect(r.instance).toBe('mainnet01');
    expect(r.height).toBeGreaterThan(30000000);
    expect(r.hashes[0].height).toBeGreaterThan(1800000);
  });
});
