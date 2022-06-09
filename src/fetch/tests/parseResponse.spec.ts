import { parseResponse } from '../parseResponse';
import { mockFetch } from './mockFetch';
import { MockTestType, mockSuccessResponse, mockFailureResponse } from './mockFetch';

const unmockedFetch = global.fetch;
/**
 * NOTE (Linda, 06/09/2022):
 * Typing `mockFetch` as jest.Mock was needed to satisfy
 * the type constraint of jest and the original `fetch` function.
 *
 * See `mockFetch.ts` for more details.
 */
beforeAll(() => { global.fetch = (mockFetch as jest.Mock); });
afterAll(() => {
  global.fetch = unmockedFetch;
});

test('should parse successful Response as expected type', async () => {
  const mockPromise:Promise<Response> = fetch('/simple/success');
  const parsedResponse:MockTestType = await parseResponse(mockPromise);
  expect(mockSuccessResponse).toEqual(parsedResponse);
});

test('should return concatenated errors', async () => {
  async function parseFailedResponse() {
    const mockPromise:Promise<Response> = fetch('/simple/failure');
    return parseResponse(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});
