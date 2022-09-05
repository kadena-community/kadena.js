import type {
  IPollResponse,
  ISendRequestBody,
  ListenResponse,
  LocalResponse,
  SendResponse,
  SPVResponse,
} from '@kadena/types';

import { testSPVProof } from './Pact';

import type { RequestInit as NodeFetchRequestInit } from 'node-fetch';

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
export async function mockFetch(
  url: string,
  init?: NodeFetchRequestInit,
): Promise<object> {
  switch (url) {
    case '/api/v1/send': {
      if (init?.body !== null && init?.body !== undefined) {
        const body = init.body;
        const parsedBody: ISendRequestBody = JSON.parse(body.toString());
        const requestKeys = parsedBody.cmds.map((cmd) => cmd.hash);
        const response: SendResponse = { requestKeys };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/api/v1/local': {
      if (init?.body !== null && init?.body !== undefined) {
        const response: LocalResponse = {
          reqKey: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
          txId: null,
          result: {
            data: 3,
            status: 'success',
          },
          gas: 0,
          continuation: null,
          metaData: null,
          logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/api/v1/poll': {
      if (init?.body !== null && init?.body !== undefined) {
        const response: IPollResponse = {
          'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8': {
            reqKey: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
            txId: null,
            result: {
              data: 3,
              status: 'success',
            },
            gas: 0,
            continuation: null,
            metaData: null,
            logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
          },
        };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/api/v1/listen': {
      if (init?.body !== null && init?.body !== undefined) {
        const response: ListenResponse = {
          reqKey: 'uolsidh4DWN-D44FoElnosL8e5-cGCGn_0l2Nct5mq8',
          txId: null,
          result: {
            data: 3,
            status: 'success',
          },
          gas: 0,
          continuation: null,
          metaData: null,
          logs: 'wsATyGqckuIvlm89hhd2j4t6RMkCrcwJe_oeCYr7Th8',
        };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/spv': {
      if (init?.body !== null && init?.body !== undefined) {
        const response: SPVResponse = testSPVProof;
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/tooyoung/spv': {
      if (init?.body !== null && init?.body !== undefined) {
        const errorMsg =
          'SPV target not reachable: target chain not reachable. Chainweb instance is too young';
        return Promise.resolve({
          ok: false,
          text: () => Promise.resolve(errorMsg),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/wrongChain/api/v1/send': {
      if (init?.body !== null && init?.body !== undefined) {
        const body = init.body;
        const parsedBody: ISendRequestBody = JSON.parse(body.toString());
        const requestKeys = parsedBody.cmds.map((cmd) => cmd.hash);
        const errorMsg: string = requestKeys
          .map(
            (rk) =>
              `Error: Validation failed for hash "${rk}": Transaction metadata (chain id, chainweb version) conflicts with this endpoint`,
          )
          .join('\n');
        return Promise.resolve({
          ok: false,
          text: () => Promise.resolve(errorMsg),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/duplicate/api/v1/send': {
      if (init?.body !== null && init?.body !== undefined) {
        const body = init.body;
        const parsedBody: ISendRequestBody = JSON.parse(body.toString());
        const requestKeys = parsedBody.cmds.map((cmd) => cmd.hash);
        const errorMsg: string = requestKeys
          .map(
            (rk) =>
              `Error: Validation failed for hash "${rk}": Transaction already exists on chain`,
          )
          .join('\n');
        return Promise.resolve({
          ok: false,
          text: () => Promise.resolve(errorMsg),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    default: {
      throw new Error(`Unhandled request URL: ${url}`);
    }
  }
}
