jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { getClient } from '../client';
import { sleep, withCounter } from '../utils/utils';

import fetch from 'cross-fetch';

describe('client', () => {
  it('uses the string input as the host for all requests', async () => {
    const response = { reqKey: 'test-key' };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });

    const hostUrl = 'http://test-blockchian-host.com';

    const { local } = getClient(hostUrl);

    const chainId = '1';
    const networkId = 'mainnet01';

    const body = {
      cmd: JSON.stringify({ networkId, meta: { chainId } }),
      sigs: ['test-sig'],
    };

    await local(body);

    expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
      `${hostUrl}/api/v1/local`,
    );
  });

  describe('local', () => {
    it('uses the hostApiGenerator function to generate hostUrl for local request', async () => {
      const response = { reqKey: 'test-key' };

      (fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        text: () => JSON.stringify(response),
        json: () => response,
      });

      const hostApiGenerator = (networkId: string, chainId: string) =>
        `http://${networkId}/${chainId}`;

      const { local } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        sigs: ['test-sig'],
      };

      await local(body);

      expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
        `${hostApiGenerator(networkId, chainId)}/api/v1/local`,
      );
    });
  });

  describe('submit', () => {
    it('uses the hostApiGenerator function to generate hostUrl for submit request', async () => {
      const response = { requestKeys: ['test-key'] };

      (fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        text: () => JSON.stringify(response),
        json: () => response,
      });

      const hostApiGenerator = (networkId: string, chainId: string) =>
        `http://${networkId}/${chainId}`;

      const { submit } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        sigs: ['test-sig'],
      };

      await submit(body);

      expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
        `${hostApiGenerator(networkId, chainId)}/api/v1/send`,
      );
    });

    it('returns requestKey and poll function that can be called for polling the status of the request', async () => {
      const response = [
        // /send response
        { requestKeys: ['test-key'] },
        // /poll response
        { 'test-key': { reqKey: 'test-key' } },
      ];

      (fetch as jest.Mock).mockImplementation(
        withCounter((counter) => {
          return Promise.resolve({
            status: 200,
            ok: true,
            text: () => JSON.stringify(response[counter - 1]),
            json: () => response[counter - 1],
          });
        }),
      );

      const hostApiGenerator = (networkId: string, chainId: string) =>
        `http://${networkId}/${chainId}`;

      const { submit } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        sigs: ['test-sig'],
      };

      const [requestKeys, poll] = await submit(body);

      expect(requestKeys).toEqual(['test-key']);

      const result = await poll();

      expect(result).toEqual(response[1]);

      expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
        `${hostApiGenerator(networkId, chainId)}/api/v1/send`,
      );
    });
  });

  describe('pollStatus', () => {
    it('calls /poll endpoint several times to get the final status of the request', async () => {
      const response = [
        // /send response
        { requestKeys: ['test-key'] },
        // first /poll
        {},
        // second /poll
        {},
        // third /poll
        { 'test-key': { reqKey: 'test-key' } },
      ];

      (fetch as jest.Mock).mockImplementation(
        withCounter((counter) => {
          return Promise.resolve({
            status: 200,
            ok: true,
            text: () => JSON.stringify(response[counter - 1]),
            json: () => response[counter - 1],
          });
        }),
      );

      const hostApiGenerator = (networkId: string, chainId: string) =>
        `http://${networkId}/${chainId}`;

      const { submit, pollStatus } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        sigs: ['test-sig'],
      };

      const [requestKeys] = await submit(body);

      expect(requestKeys).toEqual(['test-key']);

      const result = await pollStatus(requestKeys, {
        interval: 10,
      });

      expect(result).toEqual(response[3]);

      // one for the /send and three times /poll
      expect(fetch).toBeCalledTimes(4);
    });
  });

  describe('withCounter', () => {
    it('pass counter as the first are to the input function that counts the call numbers', () => {
      const fn = jest.fn();
      const wrappedFunction = withCounter(fn);
      wrappedFunction('arg1', 'arg2');
      wrappedFunction('arg1', 'arg2');

      expect(fn).toBeCalledTimes(2);
      expect(fn.mock.calls[0]).toEqual([1, 'arg1', 'arg2']);
      expect(fn.mock.calls[1]).toEqual([2, 'arg1', 'arg2']);
    });
  });

  describe('sleep', () => {
    it('returns a promise that resolves after the sleep time', (done) => {
      jest.useFakeTimers();
      const start = Date.now();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      sleep(10).then(() => {
        const end = Date.now();
        expect(end - start).toBe(10);
        done();
        jest.useRealTimers();
      });
      jest.runAllTimers();
    });
  });
});
