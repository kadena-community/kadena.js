import { SendRequestBody, SendResponse } from '../send';
import { RequestInit as NodeFetchRequestInit } from 'node-fetch';

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
export async function mockFetch(url:string, init?: NodeFetchRequestInit): Promise<object> {
  switch (url) {
    case '/api/v1/send': {
      if (init?.body !== null && init?.body !== undefined) {
        const body = init.body;
        const parsedBody:SendRequestBody = JSON.parse(body.toString());
        const requestKeys = parsedBody.cmds.map(cmd => cmd.hash);
        const response:SendResponse = { requestKeys };
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response),
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
