
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
 * For example:
 * ```
 * const unmockedFetch = global.fetch;
 * beforeAll(() => { global.fetch = (mockFetch as jest.Mock) });
 * afterAll(() => {
 *   global.fetch = unmockedFetch
 * });
 * ```
 *
 * Without it, an error is thrown because `mockFetch` doesn't satisfy the
 * type constraints of the original `fetch`.
 *
 * And if the type of `mockFetch` is changed to align with `fetch`,
 * an error is thrown because `mockFetch` doesn't return a full Response object.
 */
export async function mockFetch(url:string): Promise<object> {
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
    default: {
      throw new Error(`Unhandled request URL: ${url}`);
    }
  }
}
