jest.mock('fetch');

import { parseResponse } from '../parseResponse';

type MockTestType = {
    arr: [string],
    int: number
}

test('should parse 200 OK Response as expected type', async () => {
  const mockTestObj = {
    arr: ['hello', 'world'],
    int: 2
  };

  const mockResponse:Promise<Response> = Promise.resolve(new Response(JSON.stringify(mockTestObj), { "status" : 200 , "statusText" : "SuperSmashingGreat!" }));
  const parsedResponsePromise:Promise<MockTestType> = parseResponse(mockResponse);
  const actual:MockTestType = await parsedResponsePromise;
  const expected = mockTestObj;

  expect(expected).toEqual(actual);
});

/*test('should return concatenated errors', async () => {
    const mockTestObj = {
      arr: ['hello', 'world'],
      int: 2
    };

    global.fetch = jest.fn(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ errors: [{ message: "someErrorMessage" }, { message: "anotherErrorMessage" }] })
    })) as jest.Mock;

    const mockPromise:Promise<Response> = fetch("test.com/url", stringifyAndMakePOSTRequest("testRequest"));
    const actualPromise:Promise<MockTestType> = parseResponse(mockPromise);
    const actual:MockTestType = await actualPromise;
    const expected = mockTestObj;

    expect(expected).toEqual("somethingrandom");
  });*/
