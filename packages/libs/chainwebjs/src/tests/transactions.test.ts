/* eslint-disable @typescript-eslint/naming-convention */
import chainweb from '..';

/* ************************************************************************** */
/* Test settings */

jest.setTimeout(25000);
const debug: boolean = false;
const streamTest = test.concurrent;

/* ************************************************************************** */
/* Test Utils */

const logg = (...args: unknown[]): void => {
  if (debug) {
    console.log(...args);
  }
};

/* ************************************************************************** */
/* Blocks */

const header = {
  adjacents: {
    '10': 'oT8NLW-IZSziaOgI_1AfCdJ18u3epFpGONrkQ_F6w_Y',
    '15': 'ZoBvuaVZWBOKLaDZfM51A9LaKb5B1f2fW83VLftQa3Y',
    '5': 'SDj4sXByWVqi9epbPAiz1zqhmBGJrzSY2bPk9-IMaA0',
  },
  chainId: 0,
  chainwebVersion: 'mainnet01',
  creationTime: 1617745627822054,
  epochStart: 1617743254198411,
  featureFlags: 0,
  hash: 'BsxyrIDE0to4Kn9bjdgR_Q7Ha9bYkzd7Yso8r0zrdOc',
  height: 1511601,
  nonce: '299775665679630368',
  parent: 'XtgUmsnF20vMX4Dx9kN2W8cIXXiLNtDdFZLugMoDjrY',
  payloadHash: '2Skc1JkkBdLPkj5ZoV27nzhR3WjGD-tJiztCFGTaKIQ',
  target: '9sLMdbnd1x6vtRGpIw5tKMt_1hgprJS0oQkAAAAAAAA',
  weight: 'iFU5b59ACHSOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
};

const height = header.height;
const blockHash = header.hash;

/* ************************************************************************** */
/* By Height */

describe('by height', () => {
  test('Transactions', async () => {
    const r = await chainweb.transaction.height(0, height);
    logg('Transactions:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toHaveProperty('transaction');
    expect(r[0]).toHaveProperty('output');
    expect(r[0]).toHaveProperty('height');
    expect(r[0].height).toBe(height);
  });
});

/* ************************************************************************** */
/* By Block Hash */

describe('by blockHash', () => {
  test('Transactions', async () => {
    const r = await chainweb.transaction.blockHash(0, blockHash);
    logg('Transactions:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toHaveProperty('transaction');
    expect(r[0]).toHaveProperty('output');
    expect(r[0]).toHaveProperty('height');
    expect(r[0].height).toBe(height);
  });
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

describe('recents', () => {
  test.each([0, 10, 100])('Transactions %p', async (n) => {
    const cur = (await chainweb.cut.current()).hashes[0].height;
    const r = await chainweb.transaction.recent(0, 10, n);
    logg('Transactions:', r);
    expect(r).toBeTruthy();
    r.forEach((v, i) => {
      expect(v.height).toBeLessThanOrEqual(cur - 10);
      if (i > 0) {
        const prev = r[i - 1];
        if (prev && prev.height) {
          expect(v.height).toBeGreaterThanOrEqual(prev.height);
        }
      }
    });
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

describe('range', () => {
  test.each([10, 370])('Transactions %p', async (n) => {
    const r = await chainweb.transaction.range(0, height, height + (n - 1));
    logg('Transactions:', r);
    r.forEach((v, i) => {
      expect(v).toHaveProperty('transaction');
      expect(v).toHaveProperty('output');
      expect(v).toHaveProperty('height');
      expect(v.height).toBeGreaterThanOrEqual(header.height + i);
    });
  });
});

/* ************************************************************************** */
/* Streams */

/* Streams are backed by EventSource clients that retrieve header update
 * events from the Chainweb API.
 *
 * The depth parameter is useful to avoid receiving items from orphaned blocks.
 *
 * The functions buffer, filter, and transform the original events and
 * generate a stream of derived items to which a callback is applied.
 *
 * The functions also return the underlying EventSource object, for more
 * advanced low-level control.
 */

const sleep = (ms: number | undefined): Promise<void> =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

const allChains = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
];

describe('stream', () => {
  streamTest(
    'Transactions',
    async () => {
      let count = 0;
      const hs = chainweb.transaction.stream(1, allChains, (h) => {
        logg('new transaction', h);
        count++;
      });
      logg('transaction stream started');
      await sleep(60000);
      hs.close();
      logg('transaction stream closed');
      expect(count).toBeGreaterThanOrEqual(0);
    },
    61000,
  );
});
