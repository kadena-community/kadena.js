/**
 * Mock implementation of node-fetch's `fetch` function.
 *
 *  Usage @example:
 * ```
 *  jest.mock('node-fetch');
 *  const mockedFunctionFetch = fetch as jest.MockedFunction<typeof fetch>;
 *  mockedFunctionFetch.mockImplementation(mockFetch as jest.MockedFunction<typeof fetch>);
 * ```
 *
 */

import type {
  IBlockHeader,
  IBlockPayload,
  ICutPeerItem,
  ICutResponse,
  IPagedResponse,
} from '../types';

import { blockByHeightBranchPageMock } from './mocks/blockByHeightBranchPageMock';
import { blockByHeightCurrentCutMock } from './mocks/blockByHeightCurrentCutMock';
import { blockByHeightPayloadsMock } from './mocks/blockByHeightPayloadsMock';
import { blockRecentsPayloadsMock } from './mocks/blockRecentsPayloadsMock';
import { blockRecentsRecentHeadersMock } from './mocks/blockRecentsRecentHeaders';
import { cutPeersMock } from './mocks/cutPeers';
import { rangeHeadersMock } from './mocks/rangeHeaderMock';
import { rangePayloadsMock } from './mocks/rangePayloadsMock';

export const urlHelper = (url: URL | string): string => {
  if (url instanceof URL) {
    return url.href;
  }
  return url;
};

export const makeFetchResponse = <T>(value: T): unknown => ({
  status: 200,
  ok: true,
  json: async () => value,
});

export const mockFetch = (url: URL | string, init?: RequestInit): unknown => {
  const path = urlHelper(url);
  switch (path) {
    // Headers
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/cut':
      return makeFetchResponse<ICutResponse>(
        blockByHeightCurrentCutMock as unknown as ICutResponse,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?limit=1':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=1511601&maxheight=1511601':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockByHeightBranchPageMock as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306637&maxheight=3306636':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          0,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306646&maxheight=3306646&limit=1':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          1,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306629&maxheight=3306637&limit=9':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          9,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?limit=10':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306627&maxheight=3306636&limit=10':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306637&maxheight=3306646&limit=10':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          10,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=1511601&maxheight=1511610':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        rangeHeadersMock(20010) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=1511601&maxheight=1511610&next=inclusive%3Axz5JDTRLwqSC2T861tTGIovEcklBUbXxDw6VS7yYay4':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        rangeHeadersMock(2001010) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3349600&maxheight=3349699&limit=100':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306537&maxheight=3306636&limit=100':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          100,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306622&maxheight=3306636&limit=15': // *
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306277&maxheight=3306636&limit=359':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306278&maxheight=3306636&limit=359':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=1511601&maxheight=1511959':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?limit=359':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          359,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306277&maxheight=3306636&limit=360':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=1511601&maxheight=1511960':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306276&maxheight=3306636&limit=361':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          360,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3306276&maxheight=3306636&limit=1&next=inclusive%3Axz5JDTRLwqSC2T861tTGIovEcklBUbXxDw6VS7yYay4':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          361,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3305907&maxheight=3306636&limit=730':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          730360,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3305907&maxheight=3306636&limit=370&next=inclusive%3Axz5JDTRLwqSC2T861tTGIovEcklBUbXxDw6VS7yYay4':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          730720,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/header/branch?minheight=3305907&maxheight=3306636&limit=10&next=inclusive%3A76kklGQO0cKSxtSSrhP_iD07J94VG3PHIxTDl7kQUhk':
      return makeFetchResponse<IPagedResponse<IBlockHeader>>(
        blockRecentsRecentHeadersMock(
          730730,
        ) as unknown as IPagedResponse<IBlockHeader>,
      );

    // payload
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockByHeightPayloadsMock,
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?1':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(10) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?730':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(730) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?0':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(0) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?9':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(9) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?10':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(10) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?100':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(100) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?15':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?359':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(359) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?360':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(360) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?20010':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?30010':
    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?40010':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        rangePayloadsMock(20010) as unknown as IBlockPayload<string[]>[],
      );

    case 'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/0/payload/outputs/batch?361':
      return makeFetchResponse<IBlockPayload<string[]>[]>(
        blockRecentsPayloadsMock(361) as unknown as IBlockPayload<string[]>[],
      );

    // cuts
    case 'https://us-e1.chainweb.com/chainweb/0.0/mainnet01/cut/peer':
      return makeFetchResponse<IPagedResponse<ICutPeerItem>[]>(
        cutPeersMock as unknown as IPagedResponse<ICutPeerItem>[],
      );

    default: {
      throw new Error(`Unhandled request URL: ${url}`);
    }
  }
};
