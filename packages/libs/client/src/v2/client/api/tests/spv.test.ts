jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { withCounter } from '../../utils/utils';
import { getSpv, pollSpv } from '../spv';

import fetch from 'cross-fetch';

describe('getSpv', () => {
  it('calls /spv endpoint to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => response,
      json: () => response,
    });

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await getSpv(hostUrl, requestKey, targetChainId);

    expect(result).toBe(response);

    expect(fetch).toBeCalledWith(`${hostUrl}/spv`, {
      body: JSON.stringify({ requestKey, targetChainId }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });
});

describe('pollSpv', () => {
  it('calls /spv endpoint several times to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    (fetch as jest.Mock).mockImplementation(
      withCounter(async (counter) => {
        if (counter < 5) {
          return Promise.resolve({
            status: 400,
            ok: false,
            text: () => JSON.stringify('not found'),
            json: () => Promise.reject('parse error'),
          });
        }
        return Promise.resolve({
          status: 200,
          ok: true,
          text: () => response,
          json: () => response,
        });
      }),
    );

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await pollSpv(hostUrl, requestKey, targetChainId, {
      interval: 10,
    });

    expect(result).toBe(response);

    expect(fetch).toBeCalledWith(`${hostUrl}/spv`, {
      body: JSON.stringify({ requestKey, targetChainId }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });
});
