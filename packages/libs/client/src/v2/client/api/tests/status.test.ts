jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { sleep, withCounter } from '../../utils/utils';
import { getStatus, pollStatus } from '../status';

import fetch from 'cross-fetch';

describe('getStatus', () => {
  it('calls the /poll endpoint and returns the status of a request if its ready', async () => {
    const response = {
      ['key-1']: {
        reqKey: 'key-1',
      },
    };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await getStatus(hostUrl, requestKeys);

    expect(result['key-1'].reqKey).toBe('key-1');

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/poll`, {
      body: JSON.stringify({ requestKeys }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  it('calls the /poll endpoint and returns empty list if the statuses of none of the request are ready', async () => {
    const response = {};

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await getStatus(hostUrl, requestKeys);

    expect(result).toEqual({});

    expect(fetch).toBeCalledWith(`${hostUrl}/api/v1/poll`, {
      body: JSON.stringify({ requestKeys }),
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

    await expect(getStatus(hostUrl, ['test-key'])).rejects.toThrowError(
      new Error('Internal Server Error'),
    );
  });
});

describe('pollStatus', () => {
  it('calls the /poll endpoint several times till it gets the status of all request keys', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (fetch as jest.Mock).mockImplementation(
      withCounter((counter) => {
        return Promise.resolve({
          status: 200,
          ok: true,
          text: () => {
            JSON.stringify(responses[counter - 1] ?? {});
          },
          json: () => responses[counter - 1] ?? {},
        });
      }),
    );

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys, {
      interval: 10,
    });

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });

    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it('throws TIME_OUT_REJECT if the task get longer that in timeout option', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (fetch as jest.Mock).mockImplementation(
      withCounter(async (counter) => {
        await sleep(501);
        return Promise.resolve({
          status: 200,
          ok: true,
          text: () => {
            JSON.stringify(responses[counter - 1] ?? {});
          },
          json: () => responses[counter - 1] ?? {},
        });
      }),
    );

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const promise = pollStatus(hostUrl, requestKeys, {
      interval: 10,
      timeout: 500,
    });

    await expect(promise).rejects.toEqual(new Error('TIME_OUT_REJECT'));
  });

  it('calls onPoll call back before fetching each request key in each try', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    (fetch as jest.Mock).mockImplementation(
      withCounter(async (counter) => {
        return Promise.resolve({
          status: 200,
          ok: true,
          text: () => {
            JSON.stringify(responses[counter - 1] ?? {});
          },
          json: () => responses[counter - 1] ?? {},
        });
      }),
    );

    const onPoll = jest.fn();

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    await pollStatus(hostUrl, requestKeys, {
      interval: 10,
      onPoll,
    });

    expect(onPoll).toBeCalledTimes(6);

    // first try
    expect(onPoll.mock.calls[0][0]).toBe('key-1');
    expect(onPoll.mock.calls[1][0]).toBe('key-2');

    //second try that returns key-1 status
    expect(onPoll.mock.calls[2][0]).toBe('key-1');
    expect(onPoll.mock.calls[3][0]).toBe('key-2');

    // third try that
    expect(onPoll.mock.calls[4][0]).toBe('key-2');

    //forth try that returns key-2 status
    expect(onPoll.mock.calls[5][0]).toBe('key-2');
  });

  it("uses default options if they aren't provided", async () => {
    const responses = [
      { 'key-1': { reqKey: 'key-1' }, 'key-2': { reqKey: 'key-2' } },
    ];

    (fetch as jest.Mock).mockImplementation(
      withCounter((counter) => {
        return Promise.resolve({
          status: 200,
          ok: true,
          text: () => {
            JSON.stringify(responses[counter - 1] ?? {});
          },
          json: () => responses[counter - 1] ?? {},
        });
      }),
    );

    const hostUrl = "http://test-blockchian-host.com'";

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys);

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });

    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
