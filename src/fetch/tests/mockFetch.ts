import { SendRequestBody, SendResponse } from '../send';

export type MockTestType = {
  arr: Array<string>,
  int: number
};

export const mockSuccessResponse:MockTestType = {
  arr: ['hello', 'world'],
  int: 2,
};

export const mockFailureResponse:string = 'Some mock error was thrown.';

/**
 * Mock implementation of Fetch API's `fetch` function.
 *
 * NOTE (Linda, 06/09/2022):
 * `mockFetch` will need to be type casted as a `jest.Mock` to satisfy
 * the type constraint of jest and the original `fetch` function.
 *
 * Without it, an error is thrown because `mockFetch` doesn't satisfy the
 * type constraints of the original `fetch`.
 *
 * And if the type of `mockFetch` is changed to align with `fetch`,
 * an error is thrown because `mockFetch` doesn't return a full Response object.
 *
 *  * Usage @example:
 * ```
 *  const unmockedFetch = global.fetch;
 *  beforeAll(() => { global.fetch = (mockFetch as jest.Mock) });
 *  afterAll(() => {
 *    global.fetch = unmockedFetch
 *  });
 * ```
 *
 */
export async function mockFetch(url:string, init?: RequestInit): Promise<object> {
  switch (url) {
    case '/simple/success': {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSuccessResponse),
      });
    }
    case '/simple/failure': {
      return Promise.resolve({
        ok: false,
        text: () => Promise.resolve(mockFailureResponse),
      });
    }
    case '/api/v1/send': {
      if (init?.body !== null && init?.body !== undefined) {
        const body:BodyInit = init.body;
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
