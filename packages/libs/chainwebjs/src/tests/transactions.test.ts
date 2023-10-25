import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import chainweb from '..';
import { filterTxs } from '../transactions';
import type { IBlockPayloads, ITransactionElement } from '../types';
import { config } from './config';
import { blockByHeightBranchPageMock } from './mocks/blockByHeightBranchPageMock';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { blockByHeightPayloadsMock } from './mocks/blockByHeightPayloadsMock';
import { blockRecentsPayloadsMock } from './mocks/blockRecentsPayloadsMock';
import { blockRecentsRecentHeadersMock } from './mocks/blockRecentsRecentHeaders';
import { header } from './mocks/header';
import { rangeHeadersMock } from './mocks/rangeHeaderMock';
import { rangePayloadsMock } from './mocks/rangePayloadsMock';
import {
  filterData,
  filterDataFormatted,
  filterDataNoTx,
} from './mocks/recentsfilterDataMock';

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

/* ************************************************************************** */
/* By Height */

describe('chainweb.transaction', () => {
  it('get transaction items by height and validate', async () => {
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

    const r = await chainweb.transaction.height(
      0,
      height,
      config.network,
      config.host,
    );
    logg('Transactions:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toHaveProperty('transaction');
    expect(r[0]).toHaveProperty('output');
    expect(r[0]).toHaveProperty('height');
    expect(r[0].height).toBe(height);
  });

  /* ************************************************************************** */
  /* By Block Hash */

  it('get transaction items by blockhash and validate', async () => {
    server.resetHandlers(
      http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
        HttpResponse.json(blockByHeightCurrentCutMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockByHeightBranchPageMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockByHeightPayloadsMock),
      ),
    );

    const r = await chainweb.transaction.blockHash(
      0,
      blockHash,
      config.network,
      config.host,
    );
    logg('Transactions:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toHaveProperty('transaction');
    expect(r[0]).toHaveProperty('output');
    expect(r[0]).toHaveProperty('height');
    expect(r[0].height).toBe(height);
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

  it.each([0, 10, 100])(
    'should get transactions by maximum number og blocks %p and validate',
    async (n) => {
      server.resetHandlers(
        http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
          HttpResponse.json(blockByHeightCurrentCutMock),
        ),
        http.post(
          'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
          () => HttpResponse.json(blockRecentsRecentHeadersMock(0)),
        ),
      );

      const cur = (await chainweb.cut.current(config.network, config.host))
        .hashes[0].height;
      const r = await chainweb.transaction.recent(
        0,
        10,
        n,
        config.network,
        config.host,
      );
      logg('Transactions:', r);
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
    },
  );
  it('should get recents when default dept is set and limited to 10', async () => {
    server.resetHandlers(
      http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
        HttpResponse.json(blockByHeightCurrentCutMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockRecentsRecentHeadersMock(10)),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockRecentsPayloadsMock(10)),
      ),
    );

    const r = await chainweb.transaction.recent(
      0,
      undefined,
      10,
      config.network,
      config.host,
    );
    logg('Transactions:', r);
    expect(r).toBeTruthy();
  });
  it('should get recents when default dept is set', async () => {
    server.resetHandlers(
      http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
        HttpResponse.json(blockByHeightCurrentCutMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(blockRecentsRecentHeadersMock(1)),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(blockRecentsPayloadsMock(10)),
      ),
    );

    const r = await chainweb.transaction.recent(
      0,
      undefined,
      undefined,
      config.network,
      config.host,
    );
    logg('Transactions:', r);
    expect(r).toBeTruthy();
  });
});

describe('Transaction filter', () => {
  it('should filter data and return formatted', () => {
    const data = filterTxs(
      filterData as unknown as IBlockPayloads<ITransactionElement>[],
    );
    expect(data).toEqual(filterDataFormatted);
  });
  it('should filter data and return formatted without transactions', () => {
    const data = filterTxs(
      filterDataNoTx as unknown as IBlockPayloads<ITransactionElement>[],
    );
    expect(data).toEqual([]);
  });
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

describe('chainweb.transaction', () => {
  it('should get transactions by range n', async () => {
    server.resetHandlers(
      http.get('https://api.chainweb.com/chainweb/0.0/mainnet01/cut', () =>
        HttpResponse.json(blockByHeightCurrentCutMock),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch',
        () => HttpResponse.json(rangeHeadersMock(2001010)),
      ),
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch',
        () => HttpResponse.json(rangePayloadsMock(20010)),
      ),
    );

    const n = 10;
    const r = await chainweb.transaction.range(
      0,
      height,
      height + (n - 1),
      config.network,
      config.host,
      parseInt(`400${n}`, 10),
    );
    logg('Transactions:', r);
    r.forEach((v, i) => {
      expect(v).toHaveProperty('transaction');
      expect(v).toHaveProperty('output');
      expect(v).toHaveProperty('height');
      expect(v.height).toBeGreaterThanOrEqual(header.height + i);
    });
  });
});
