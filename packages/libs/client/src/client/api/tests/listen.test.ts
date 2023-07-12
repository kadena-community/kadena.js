jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { listen } from '../listen';

import fetch from 'cross-fetch';

describe('listen', () => {
  it('calls the /listen endpoint and returns the status of a request', async () => {
    const response = {
      reqKey: 'key-1',
    };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKey = 'key-1';

    const result = await listen(hostUrl, requestKey);

    expect(result.reqKey).toBe('key-1');

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/listen`, {
      body: JSON.stringify({ listen: requestKey }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('throws an error if the response.ok is false', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      status: 500,
      ok: false,
      text: () => 'Internal Server Error',
      json: () => {
        throw new Error('Internal Server Error');
      },
    });

    const hostUrl = "http://test-blockchian-host.com'";

    await expect(listen(hostUrl, 'test-key')).rejects.toThrowError(
      new Error('Internal Server Error'),
    );
  });
});
