import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import chainweb from '..';
import { config } from './config';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { blockByHeightPayloadsMock } from './mocks/blockByHeightPayloadsMock';
import { blockRecentsPayloadsMock } from './mocks/blockRecentsPayloadsMock';
import { blockRecentsRecentHeadersMock } from './mocks/blockRecentsRecentHeaders';
import { header } from './mocks/header';
import { rangeHeadersMock } from './mocks/rangeHeaderMock';
import { rangePayloadsMock } from './mocks/rangePayloadsMock';

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

const height = header.height;
const blockHash = header.hash;

describe('chainweb.block', () => {
  /* ************************************************************************** */
  /* By Height */

  it('gets the block by height an validates', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json({ limit: 1, items: [header], next: null }),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    const r = await chainweb.block.height(
      0,
      height,
      config.network,
      config.host,
    );
    logg('Block:', r);
    expect(r).toHaveProperty('header');
    expect(r.header).toEqual(header);
    expect(r).toHaveProperty('payload');
    expect(r.payload.payloadHash).toEqual(header.payloadHash);
  });

  /* ************************************************************************** */
  /* By Block Hash */

  it('gets the block by block hash an validates', async () => {
    server.resetHandlers(
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json({ limit: 1, items: [header], next: null }),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    const r = await chainweb.block.blockHash(
      0,
      blockHash,
      config.network,
      config.host,
    );
    logg('Block:', r);
    expect(r).toHaveProperty('header');
    expect(r.header).toEqual(header);
    expect(r).toHaveProperty('payload');
    expect(r.payload.payloadHash).toEqual(header.payloadHash);
  });

  it('throws on fetching Block by blockhash without payload', async () => {
    server.resetHandlers(
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json({ limit: 1, items: [header], next: null }),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
        { once: true },
      ),
    );

    try {
      const r = await chainweb.block.blockHash(
        0,
        blockHash,
        config.network,
        config.host,
      );
      logg('Block:', r);
    } catch (err) {
      const error =
        'failed to get payloads for some headers. Missing [{"hash":"BsxyrIDE0to4Kn9bjdgR_Q7Ha9bYkzd7Yso8r0zrdOc","height":1511601}]';
      expect(err.message).toMatch(error);
    }
  });

  /* ************************************************************************** */
  /* Ranges */

  /* These functions query items from a range of block heights and return the
   * result as an array.
   *
   * Currently, there is no support for paging. There is thus a limit on the
   * size of the range that can be handled in a single call. The function simply
   * return whatever fits into a server page.
   *
   * Streams are online and only return items from blocks that got mined after the
   * stream was started. They are thus useful for prompt notification of new
   * items. In order of exhaustively querying all, including old, items, one
   * should also use `range` or `recent` queries for the respective type of item.
   */

  /* ************************************************************************** */
  /* By Range */

  it('gets block by range and validates', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(rangeHeadersMock(20010)),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(rangePayloadsMock(20010)),
      ),
    );

    const n = 10;
    const r = await chainweb.block.range(
      0,
      height,
      height + (n - 1),
      config.network,
      config.host,
      parseInt(`200${n}`, 10),
    );

    logg('Block:', r);
    expect(r.length).toEqual(n);
    expect(r[0].header).toEqual(header);
    r.forEach((v, i) => {
      expect(v.payload.payloadHash).toEqual(v.header.payloadHash);
      expect(v.header.height).toBe(header.height + i);
      expect(v.header.chainwebVersion).toBe(header.chainwebVersion);
      if (i > 1) {
        expect(v.header.creationTime).toBeGreaterThan(header.creationTime);
        expect(v.header.creationTime).toBeGreaterThan(
          r[i - 1].header.creationTime,
        );
      }
    });
  });

  /* ************************************************************************** */
  /* By Recent */

  it.each([10, 100, 359, 360, 730])(
    'gets recent blocks with limit %p',
    async (n) => {
      server.resetHandlers(
        http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
          HttpResponse.json(blockByHeightCurrentCutMock),
        ),
        http.post(
          'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
          ({ request }) => {
            let m = n;
            if (n === 730) {
              const url = new URL(request.url);
              const limit = url.searchParams.get('limit');
              if (limit === '730') m = 730360;
              if (limit === '370') m = 730720;
              if (limit === '10') m = 730730;
            }
            return HttpResponse.json(blockRecentsRecentHeadersMock(m));
          },
        ),
        http.post(
          'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
          () => HttpResponse.json(blockRecentsPayloadsMock(n)),
          { once: true },
        ),
      );

      const cur = (await chainweb.cut.current(config.network, config.host))
        .hashes[0].height;
      const r = await chainweb.block.recent(
        0,
        10,
        n,
        config.network,
        config.host,
      );
      logg('Block:', r);
      expect(r).toBeTruthy();
      expect(r.length).toBe(n);
      r.forEach((v, i) => {
        expect(v.header.height).toBeLessThanOrEqual(cur - 10);
        expect(v.payload).toHaveProperty('coinbase');
        expect(v.header.chainwebVersion).toBe('mainnet01');
        expect(v.payload.payloadHash).toEqual(v.header.payloadHash);
        if (i > 0) {
          expect(v.header.height).toBe(r[i - 1].header.height + 1);
        }
      });
    },
  );

  it('recgets recent blocks with low dept', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockRecentsRecentHeadersMock(10)),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockRecentsPayloadsMock(10)),
        { once: true },
      ),
    );

    const r = await chainweb.block.recent(
      0,
      0,
      10,
      config.network,
      config.host,
    );
    logg('Block:', r);
    expect(r).toBeTruthy();
    expect(r.length).toBe(10);
  });

  it('throws when payload is not in sync with headers', async () => {
    server.resetHandlers(
      http.get(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/cut',
        () => HttpResponse.json(blockByHeightCurrentCutMock),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockRecentsRecentHeadersMock(9)),
        { once: true },
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockRecentsPayloadsMock(9)),
        { once: true },
      ),
    );

    await expect(async () => {
      const r = await chainweb.block.recent(
        0,
        9,
        9,
        config.network,
        config.host,
      );
      logg('Block:', r);
      expect(r).toBeTruthy();
      expect(r.length).toBe(10);
    }).rejects.toThrow(
      'failed to get payloads for some headers. Missing jvstHn1mXqNjPqeGDGkEvtBN4yKy5JglL-BbVr-a76A',
    );
  });
});
