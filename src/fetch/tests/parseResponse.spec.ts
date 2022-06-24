import { parseResponse } from '../parseResponse';
import { Response } from 'node-fetch';

test('should parse successful Response as expected type', async () => {
  type MockTestType = {
    arr: Array<string>,
    int: number
  };
  const mockSuccessResponse:MockTestType = {
    arr: ['hello', 'world'],
    int: 2,
  };
  const mockPromise = Promise.resolve(new Response(JSON.stringify(mockSuccessResponse)));
  const parsedResponse:MockTestType = await parseResponse(mockPromise);
  expect(mockSuccessResponse).toEqual(parsedResponse);
});

test('should fail if Response promise was an error', async () => {
  const mockFailureResponse:string = 'Some mock error was thrown.';
  async function parseFailedResponse() {
    const mockPromise = Promise.reject(new Error(mockFailureResponse));
    return parseResponse(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});

test('should fail if Response status not `ok`', async () => {
  const mockFailureResponse:string = 'Some API error message.';
  async function parseFailedResponse() {
    const mockPromise = Promise.resolve(new Response(mockFailureResponse, {status: 404}));
    return parseResponse(mockPromise);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});
