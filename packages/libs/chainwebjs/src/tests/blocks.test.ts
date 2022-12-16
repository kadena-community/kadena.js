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
  test('Block', async () => {
    const r = await chainweb.block.height(0, height);
    logg('Block:', r);
    expect(r).toHaveProperty('header');
    expect(r.header).toEqual(header);
    expect(r).toHaveProperty('payload');
    expect(r.payload.payloadHash).toEqual(header.payloadHash);
  });
});

/* ************************************************************************** */
/* By Block Hash */

describe('by blockHash', () => {
  test('Block', async () => {
    const r = await chainweb.block.blockHash(0, blockHash);
    logg('Block:', r);
    expect(r).toHaveProperty('header');
    expect(r.header).toEqual(header);
    expect(r).toHaveProperty('payload');
    expect(r.payload.payloadHash).toEqual(header.payloadHash);
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
  test.each([0, 10, 359, 360, 361])('Block %p', async (n) => {
    const cur = (
      await chainweb.cut.current('mainnet01', 'https://api.chainweb.com')
    ).hashes[0].height;
    const r = await chainweb.block.recent(0, 10, n);
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
  test.each([1, 10, 359, 360, 361, 730])('Block %p', async (n) => {
    const r = await chainweb.block.range(0, height, height + (n - 1));
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

const chains = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18];

describe('stream', () => {
  streamTest(
    'Block',
    async () => {
      let count = 0;
      const hs = chainweb.block.stream(1, chains, (h) => {
        logg('new block', h);
        expect(h.header.chainId % 2).toBe(0);
        count++;
      });
      logg('block stream started');
      await sleep(60000);
      hs.close();
      logg('block stream closed');
      expect(count).toBeGreaterThan(4);
    },
    61000,
  );
});
