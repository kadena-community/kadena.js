import { parseResponse } from '../parseResponse';

import { Response as NodeFetchResponse } from 'node-fetch';

test('should parse successful Response as expected type', async () => {
  interface IMockTestType {
    arr: Array<string>;
    int: number;
  }
  const mockSuccessResponse: IMockTestType = {
    arr: ['hello', 'world'],
    int: 2,
  };
  const mockPromise = Promise.resolve(
    new NodeFetchResponse(JSON.stringify(mockSuccessResponse)),
  );
  const parsedResponse: IMockTestType = await parseResponse(mockPromise);
  expect(mockSuccessResponse).toEqual(parsedResponse);
});

test('should fail if Response promise was an error', async () => {
  const mockFailureResponse = 'Some mock error was thrown.';
  async function parseFailedResponse(): Promise<unknown> {
    const mockPromise = Promise.reject(new Error(mockFailureResponse));
    return parseResponse(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});

test('should fail if Response status not `ok`', async () => {
  const mockFailureResponse = 'Some API error message.';
  async function parseFailedResponse(): Promise<unknown> {
    const mockPromise = Promise.resolve(
      new NodeFetchResponse(mockFailureResponse, { status: 404 }),
    );
    return parseResponse(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});
