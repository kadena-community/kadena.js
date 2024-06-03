import { expect, test } from 'vitest';
import { parseResponse } from '../parseResponse';

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
    new Response(JSON.stringify(mockSuccessResponse)),
  );

  const mockedData = await mockPromise;

  const parsedResponse: IMockTestType = await parseResponse(
    mockedData as Response,
  );
  expect(mockSuccessResponse).toEqual(parsedResponse);
});

test('should fail if Response promise was an error', async () => {
  const mockFailureResponse = 'Some mock error was thrown.';
  async function parseFailedResponse(): Promise<unknown> {
    const mockPromise = Promise.reject(new Error(mockFailureResponse));

    const mockedData = await mockPromise;

    return parseResponse(mockedData as Response);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});

test('should fail if Response status not `ok`', async () => {
  const mockFailureResponse = 'Some API error message.';
  async function parseFailedResponse(): Promise<unknown> {
    const mockPromise = Promise.resolve(
      new Response(mockFailureResponse, { status: 404 }),
    );

    const mockedData = await mockPromise;

    return parseResponse(mockedData as Response);
  }

  return expect(parseFailedResponse).rejects.toThrowError(mockFailureResponse);
});
