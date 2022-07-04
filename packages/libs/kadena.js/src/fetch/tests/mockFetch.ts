import type { ISendRequestBody, ISendResponse } from '../send';

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
        const response: ISendResponse = { requestKeys };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
        });
      } else {
        throw new Error('Expected RequestInit body not found.');
      }
    }
    case '/wrongChain/chain/1/pact/api/v1/send': {
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
    case '/duplicate/chain/0/pact/api/v1/send': {
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
