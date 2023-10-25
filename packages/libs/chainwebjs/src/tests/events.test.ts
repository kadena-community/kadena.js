import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import chainweb from '..';
import { config } from './config';
import { blockByHeightBranchPageMock } from './mocks/blockByHeightBranchPageMock';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { blockByHeightPayloadsMock } from './mocks/blockByHeightPayloadsMock';
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
/* Blocks */

const pactEvent = {
  height: 1511601,
  module: {
    name: 'coin',
    namespace: null,
  },
  moduleHash: 'ut_J_ZNkoyaPUEJhiwVeWnkSQn9JT9sQCWKdjjVVrWo',
  name: 'TRANSFER',
  params: [
    '4677a09ea1602e4e09fe01eb1196cf47c0f44aa44aac903d5f61be7da3425128',
    'f6357785d8b147c1fac66cdbd607a0b1208d62996d7d62cc92856d0ab229bea2',
    10462.28,
  ],
};

const height = header.height;
const blockHash = header.hash;

describe('chainweb.event', () => {
  /* ************************************************************************** */
  /* By Height */

  it('gets event by height and validates', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockByHeightBranchPageMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    const r = await chainweb.event.height(
      0,
      height,
      config.network,
      config.host,
    );
    logg('Events:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toEqual(pactEvent);
  });

  /* ************************************************************************** */
  /* By Block Hash */

  it('Gets event blockhash and validates', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockByHeightBranchPageMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    const r = await chainweb.event.blockHash(
      0,
      blockHash,
      config.network,
      config.host,
    );
    logg('Events:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toEqual(pactEvent);
  });

  /* ************************************************************************** */
  /* Recents */

  /* These functions return items from recent blocks in the block history starting
   * at a given depth.
   *
   * The depth parameter is useful to avoid receiving items from orphaned blocks.
   *
   * Currently, there is no support for paging. There is thus a limit on the
   * size of the range that can be handled in a single call. The function simply
   * return whatever fits into a server page.
   */

  /* ************************************************************************** */
  /* By Recent */

  it('gets items from recent block by event', async () => {
    server.resetHandlers(
      http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
        HttpResponse.json(blockByHeightCurrentCutMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockByHeightBranchPageMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    const cur = (await chainweb.cut.current(config.network, config.host))
      .hashes[0].height;
    const r = await chainweb.event.recent(
      0,
      10,
      15,
      config.network,
      config.host,
    );
    logg('Events:', r);
    expect(r).toBeTruthy();
    r.forEach((v, i) => {
      expect(v.height).toBeLessThanOrEqual(cur - 10);
      if (i > 0) {
        const prev = r[i - 1];
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (prev && prev.height) {
          expect(v.height).toBeGreaterThanOrEqual(prev.height);
        }
      }
    });
  });
});
