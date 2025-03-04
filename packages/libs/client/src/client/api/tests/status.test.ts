import { HttpResponse, delay, http } from 'msw';
import { setupServer } from 'msw/node';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { pollStatus } from '../status';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const post = (
  path: string,
  response: string | Record<string, unknown> | Response,
  status = 200,
  wait?: number,
): ReturnType<typeof http.post> =>
  http.post(
    path,
    async () => {
      await delay(wait ?? 0);
      return typeof response === 'string'
        ? new HttpResponse(response, { status })
        : HttpResponse.json(response, { status });
    },
    { once: true },
  );

describe('pollStatus', () => {
  it('calls the /poll endpoint several times till it gets the status of all request keys', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', responses[0]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[1]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[2]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[3]),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys, {
      interval: 10,
    });

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });
  });

  it('throws TIME_OUT_REJECT if the task get longer than set in timeout option', async () => {
    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', {}, 200, 75),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKeys = ['key-1', 'key-2'];

    const promise = pollStatus(hostUrl, requestKeys, {
      interval: 10,
      timeout: 50,
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

    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', responses[0]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[1]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[2]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[3]),
    );

    const onPoll = vi.fn();

    const hostUrl = 'http://test-blockchain-host.com';

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

    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', responses[0]),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKeys = ['key-1', 'key-2'];

    const result = await pollStatus(hostUrl, requestKeys);

    expect(result).toEqual({
      'key-1': { reqKey: 'key-1' },
      'key-2': { reqKey: 'key-2' },
    });
  });

  it('calls onResult call back after each request key is fetched', async () => {
    const responses = [
      {},
      { 'key-1': { reqKey: 'key-1' } },
      {},
      { 'key-2': { reqKey: 'key-2' } },
    ];

    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', responses[0]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[1]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[2]),
      post('http://test-blockchain-host.com/api/v1/poll', responses[3]),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKeys = ['key-1', 'key-2'];

    const onResult = vi.fn();

    await pollStatus(hostUrl, requestKeys, { interval: 10, onResult });
    expect(onResult).toBeCalledTimes(2);
    expect(onResult.mock.calls[0]).toEqual(['key-1', { reqKey: 'key-1' }]);
    expect(onResult.mock.calls[1]).toEqual(['key-2', { reqKey: 'key-2' }]);
  });
  it('calls onPoll call back with error if the request fails', async () => {
    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/poll', {}),
    );

    const onPoll = vi.fn();

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKeys = ['key-1', 'key-2'];

    await expect(
      pollStatus(hostUrl, requestKeys, { interval: 10, timeout: 50, onPoll }),
    ).rejects.toEqual(new Error('TIME_OUT_REJECT'));

    expect(onPoll.mock.calls.at(-1)[1] instanceof Error).toBe(true);
  });
});
