jest.mock('cross-fetch');
import fetch, { Response } from 'cross-fetch';
import { callLocal } from '../callLocal';

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('callLocal', () => {
  it('returns the correct jsonResponse on success', async () => {
    const response = new Response();

    response.json = jest.fn().mockReturnValue({ json: 'some json' });
    response.text = jest.fn().mockReturnValue('some text');
    response.clone = jest.fn().mockImplementation(() => response);

    mockedFetch.mockResolvedValue(response);

    const result = await callLocal('https://api.chainweb.com', 'body');

    expect(result.jsonResponse).toEqual({ json: 'some json' });
  });

  it('returns the correct textResponse on success', async () => {
    const response = new Response();

    response.text = jest.fn().mockReturnValue('some text');
    response.clone = jest.fn().mockImplementation(() => response);

    mockedFetch.mockResolvedValue(response);

    const result = await callLocal('https://api.chainweb.com', 'body');

    expect(result.textResponse).toBe('some text');
  });
});
