/* eslint-disable @typescript-eslint/naming-convention */

jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { mockFetch } from './mokker';

import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);

import chainweb from '..';
/* ************************************************************************** */
/* Test settings */

jest.setTimeout(25000);
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

/* ************************************************************************** */
/* By Height */

describe('by height', () => {
  test('Events', async () => {
    const r = await chainweb.event.height(0, height);
    logg('Events:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toEqual(pactEvent);
  });
});

/* ************************************************************************** */
/* By Block Hash */

describe('by blockHash', () => {
  test('Events', async () => {
    const r = await chainweb.event.blockHash(0, blockHash);
    logg('Events:', r);
    expect(r.length).toBe(1);
    expect(r[0]).toEqual(pactEvent);
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
  test('Events', async () => {
    const cur = (await chainweb.cut.current()).hashes[0].height;
    const r = await chainweb.event.recent(0, 10, 15);
    logg('Events:', r);
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
  test.each([10])('Transactions %p', async (n) => {
    const r = await chainweb.transaction.range(
      0,
      height,
      height + (n - 1),
      undefined,
      undefined,
      parseInt(`300${n}`, 10),
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
