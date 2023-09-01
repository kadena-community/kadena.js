jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { makeFetchResponse, mockFetch, urlHelper } from './mokker';

import fetch from 'cross-fetch';

const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
mockedFunctionFetch.mockImplementation(
  mockFetch as jest.MockedFunction<typeof fetch>,
);
import {
  type IBlockHeader,
  type IBlockPayload,
  type IPagedResponse,
} from '../types';
import chainweb from '..';

import { header } from './mocks/header';
import { config } from './config';
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

beforeEach(() => {
  mockedFunctionFetch.mockImplementation(
    mockFetch as jest.MockedFunction<typeof fetch>,
  );
});
/* ************************************************************************** */
/* Blocks */

const height = header.height;
const blockHash = header.hash;

describe('chainweb.block', () => {
  /* ************************************************************************** */
  /* By Height */

  it('gets the block by height an validates', async () => {
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
    const localMockFetch = (url: URL | string, init?: RequestInit): unknown => {
      const path = urlHelper(url);
      switch (path) {
        case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch':
          return makeFetchResponse<IBlockPayload<string[]>[]>(
            [] as unknown as IBlockPayload<string[]>[],
          );
        default:
          return makeFetchResponse<IPagedResponse<IBlockHeader>>({
            limit: 1,
            items: [
              {
                nonce: '299775665679630368',
                creationTime: 1617745627822054,
                parent: 'XtgUmsnF20vMX4Dx9kN2W8cIXXiLNtDdFZLugMoDjrY',
                adjacents: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  '15': 'ZoBvuaVZWBOKLaDZfM51A9LaKb5B1f2fW83VLftQa3Y',
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  '10': 'oT8NLW-IZSziaOgI_1AfCdJ18u3epFpGONrkQ_F6w_Y',
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  '5': 'SDj4sXByWVqi9epbPAiz1zqhmBGJrzSY2bPk9-IMaA0',
                },
                target: '9sLMdbnd1x6vtRGpIw5tKMt_1hgprJS0oQkAAAAAAAA',
                payloadHash: '2Skc1JkkBdLPkj5ZoV27nzhR3WjGD-tJiztCFGTaKIQ',
                chainId: 0,
                weight: 'iFU5b59ACHSOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
                height: 1511601,
                chainwebVersion: 'mainnet01',
                epochStart: 1617743254198411,
                featureFlags: 0,
                hash: 'BsxyrIDE0to4Kn9bjdgR_Q7Ha9bYkzd7Yso8r0zrdOc',
              },
            ],
            next: null,
          } as unknown as IPagedResponse<IBlockHeader>);
      }
    };

    mockedFunctionFetch.mockImplementation(
      localMockFetch as jest.MockedFunction<typeof fetch>,
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
