import { parseResponseTEXT } from '../parseResponseTEXT';

import { Response as NodeFetchResponse } from 'node-fetch';

test('should parse successful Response as expected type', async () => {
  type MockTestType = string;
  const mockSuccessResponse: MockTestType = 'hello_world';
  const mockPromise = Promise.resolve(
    new NodeFetchResponse(mockSuccessResponse),
  );
  const parsedResponse: MockTestType = await parseResponseTEXT(mockPromise);
  expect(mockSuccessResponse).toEqual(parsedResponse);
});

test('should fail if Response promise was an error', async () => {
  const mockFailureResponse = 'Some mock error was thrown.';
  async function parseFailedResponse() {
    const mockPromise = Promise.reject(new Error(mockFailureResponse));
    return parseResponseTEXT(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});

test('should fail if Response status not `ok`', async () => {
  const mockFailureResponse = 'Some API error message.';
  async function parseFailedResponse() {
    const mockPromise = Promise.resolve(
      new NodeFetchResponse(mockFailureResponse, { status: 404 }),
    );
    return parseResponseTEXT(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});
