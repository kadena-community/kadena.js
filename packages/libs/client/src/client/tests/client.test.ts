jest.mock('@kadena/chainweb-node-client', () => ({
  __esModule: true,
  ...jest.requireActual('@kadena/chainweb-node-client'),
  poll: jest.fn(),
  spv: jest.fn(),
  send: jest.fn(),
  local: jest.fn(),
  listen: jest.fn(),
}));

import * as chainwebClient from '@kadena/chainweb-node-client';
import { ChainId } from '@kadena/types';

import { getClient } from '../client';
import { kadenaHostGenerator, withCounter } from '../utils/utils';

const hostApiGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => `http://${networkId}/${chainId}`;

describe('client', () => {
  it('uses the string input as the host for all requests', async () => {
    const response = { reqKey: 'test-key' };

    (chainwebClient.local as jest.Mock).mockResolvedValue(response);

    const hostUrl = 'http://test-blockchain-host.com';

    const { local } = getClient(hostUrl);

    const body = {
      cmd: JSON.stringify({ networkId: 'mainnet01', meta: { chainId: '1' } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    const result = await local(body);

    expect(result).toEqual(response);

    expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
      body,
      hostUrl,
    ]);
  });

  it('uses kadenaHostGenerator if called without argument', async () => {
    const { local } = getClient();

    const response = { reqKey: 'test-key' };

    (chainwebClient.local as jest.Mock).mockResolvedValue(response);

    const networkId = 'mainnet01';
    const chainId = '1';

    const body = {
      cmd: JSON.stringify({ networkId, meta: { chainId } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    await local(body);

    expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
      body,
      kadenaHostGenerator({ networkId, chainId }),
    ]);
  });

  describe('local', () => {
    it('uses the hostApiGenerator function to generate hostUrl for local request', async () => {
      const response = { reqKey: 'test-key' };

      (chainwebClient.local as jest.Mock).mockResolvedValue(response);

      const { local } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      await local(body);

      expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
        body,
        hostApiGenerator({ networkId, chainId }),
      ]);
    });
  });

  describe('submit', () => {
    it('uses the hostApiGenerator function to generate hostUrl for submit request', async () => {
      const response = { requestKeys: ['test-key'] };

      (chainwebClient.send as jest.Mock).mockResolvedValue(response);

      const { submit } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      await submit(body);

      expect(chainwebClient.send).toBeCalledWith(
        { cmds: [body] },
        hostApiGenerator({ networkId, chainId }),
      );
    });

    it('returns requestKey if input is a single command', async () => {
      (chainwebClient.send as jest.Mock).mockResolvedValue({
        requestKeys: ['test-key'],
      });

      const { submit } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const requestKey = await submit(body);

      expect(requestKey).toEqual('test-key');
    });

    it('returns requestKeys if input is an array', async () => {
      (chainwebClient.send as jest.Mock).mockResolvedValue({
        requestKeys: ['test-key'],
      });

      const { submit } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const requestKeys = await submit([body]);

      expect(requestKeys).toEqual(['test-key']);
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
        // first /poll
        {},
        // second /poll
        {},
        // third /poll
        { 'test-key': { reqKey: 'test-key' } },
      ];

      (chainwebClient.send as jest.Mock).mockResolvedValue({
        requestKeys: ['test-key'],
      });

      (chainwebClient.poll as jest.Mock).mockImplementation(
        withCounter((counter) => {
          return Promise.resolve(response[counter - 1]);
        }),
      );

      const { submit, pollStatus } = getClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const requestKey = await submit(body);

      expect(requestKey).toEqual('test-key');

      const result = await pollStatus(requestKey, {
        interval: 10,
      });

      expect(result).toEqual(response[2]);

      expect(chainwebClient.send).toBeCalledTimes(1);
      expect(chainwebClient.poll).toBeCalledTimes(3);
    });
  });

  describe('getStatus', () => {
    it('calls /poll endpoint once to get the status of the request', async () => {
      const response = {};

      (chainwebClient.poll as jest.Mock).mockResolvedValue(response);

      const { getStatus } = getClient('http://test-host.com');

      const result = await getStatus('test-key');

      expect(result).toEqual(response);

      expect(chainwebClient.poll).toBeCalledTimes(1);
    });
  });

  describe('listen', () => {
    it('calls /listen endpoint get the status of the request', async () => {
      const response = { reqKey: 'test-key' };

      (chainwebClient.listen as jest.Mock).mockResolvedValue(response);

      const { listen } = getClient('http://test-host.com');

      const result = await listen('test-key');

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.listen).toBeCalledTimes(1);
    });
  });

  describe('getSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      const response = 'proof';

      (chainwebClient.spv as jest.Mock).mockResolvedValue(response);

      const { createSpv: getSpv } = getClient('http://test-host.com');

      const result = await getSpv('test-key', '2');

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.spv).toBeCalledTimes(1);
    });
  });

  describe('pollSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      const response = 'proof';

      (chainwebClient.spv as jest.Mock).mockImplementation(
        withCounter((counter) => {
          if (counter < 4) {
            return Promise.reject(new Error('not found'));
          }
          return Promise.resolve(response);
        }),
      );

      const { pollCreateSpv: pollSpv } = getClient('http://test-host.com');

      const result = await pollSpv('test-key', '2', { interval: 10 });

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.spv).toBeCalledTimes(4);
    });
  });
});
