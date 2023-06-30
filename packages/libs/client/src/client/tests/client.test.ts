jest.mock('cross-fetch', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

import { getClient } from '../client';
import { kadenaHostGenerator, withCounter } from '../utils/utils';

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

  it('uses kadenaHostGenerator if called without argument', async () => {
    const { local } = getClient();

    const response = { reqKey: 'test-key' };

    (fetch as jest.Mock).mockResolvedValue({
      status: 200,
      ok: true,
      text: () => JSON.stringify(response),
      json: () => response,
    });

    const networkId = 'mainnet01';
    const chainId = '1';

    const body = {
      cmd: JSON.stringify({ networkId, meta: { chainId } }),
      sigs: ['test-sig'],
    };

    await local(body);

    expect((fetch as jest.Mock).mock.calls[0][0]).toBe(
      `${kadenaHostGenerator(networkId, chainId)}/api/v1/local`,
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

    it('throes an error if the command list is empty', async () => {
      const { submit } = getClient(() => 'http://test-host.com');
      await expect(submit([])).rejects.toThrowError(
        new Error('EMPTY_COMMAND_LIST'),
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

  describe('getStatus', () => {
    it('calls /poll endpoint once to get the status of the request', async () => {
      const response = {};

      (fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        text: () => JSON.stringify(response),
        json: () => response,
      });

      const { getStatus } = getClient('http://test-host.com');

      const result = await getStatus('test-key');

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(fetch).toBeCalledTimes(1);
    });
  });

  describe('getSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      const response = 'proof';

      (fetch as jest.Mock).mockResolvedValue({
        status: 200,
        ok: true,
        text: () => response,
        json: () => JSON.parse(response),
      });

      const { getSpv } = getClient('http://test-host.com');

      const result = await getSpv('test-key', '2');

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(fetch).toBeCalledTimes(1);
    });
  });

  describe('pollSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      const response = 'proof';

      (fetch as jest.Mock).mockImplementation(
        withCounter((counter) =>
          Promise.resolve(
            counter < 4
              ? {
                  status: 400,
                  ok: false,
                  text: () => 'not found',
                  json: () => {
                    throw new Error('not found');
                  },
                }
              : {
                  status: 200,
                  ok: true,
                  text: () => response,
                  json: () => response,
                },
          ),
        ),
      );

      const { pollSpv } = getClient('http://test-host.com');

      const result = await pollSpv('test-key', '2', { interval: 10 });

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(fetch).toBeCalledTimes(4);
    });
  });
});
