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

import { getClient } from '../client';
import { withCounter } from '../utils/utils';

describe('client', () => {
  it('uses the networks option to generate the host for all requests', async () => {
    const response = { reqKey: 'test-key' };

    (chainwebClient.local as jest.Mock).mockResolvedValue(response);

    const { local } = getClient({
      networks: {
        mynet01: 'http://myblockchain.net',
      },
    });

    const body = {
      cmd: JSON.stringify({ networkId: 'mynet01', meta: { chainId: '1' } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    const result = await local(body);

    expect(result).toEqual(response);

    expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
      body,
      'http://myblockchain.net/chainweb/0.0/mynet01/chain/1/pact',
    ]);
  });

  it('uses the url generator in networks option to generate the host for all requests', async () => {
    const response = { reqKey: 'test-key' };

    (chainwebClient.local as jest.Mock).mockResolvedValue(response);

    const { local } = getClient({
      networks: {
        mynet01: (chainId) => `http://myblockchain.net/${chainId}/pact`,
      },
    });

    const body = {
      cmd: JSON.stringify({ networkId: 'mynet01', meta: { chainId: '1' } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    const result = await local(body);

    expect(result).toEqual(response);

    expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
      body,
      'http://myblockchain.net/1/pact',
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
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact',
    ]);
  });

  describe('local', () => {
    it('uses the hostMap object to generate hostUrl for local request', async () => {
      const response = { reqKey: 'test-key' };

      (chainwebClient.local as jest.Mock).mockResolvedValue(response);

      const { local } = getClient({
        networks: {
          'my-network': 'http://localhost:8080/',
        },
      });

      const networkId = 'my-network';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      await local(body);

      expect((chainwebClient.local as jest.Mock).mock.calls[0]).toEqual([
        body,
        `http://localhost:8080/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      ]);
    });
  });

  describe('submit', () => {
    it('uses the hostApiGenerator function to generate hostUrl for submit request', async () => {
      const response = { requestKeys: ['test-key'] };

      (chainwebClient.send as jest.Mock).mockResolvedValue(response);

      const { submit } = getClient({
        networks: {
          'my-network': 'http://localhost:8080/',
        },
      });

      const networkId = 'my-network';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      await submit(body);

      expect(chainwebClient.send).toBeCalledWith(
        { cmds: [body] },
        `http://localhost:8080/chainweb/0.0/${networkId}/chain/${chainId}/pact`,
      );
    });

    it('returns requestKey if input is a single command', async () => {
      (chainwebClient.send as jest.Mock).mockResolvedValue({
        requestKeys: ['test-key'],
      });

      const { submit } = getClient();

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

      const { submit } = getClient();

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
      const { submit } = getClient();
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

      const { submit, pollStatus } = getClient();

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

      const { getStatus } = getClient();

      const result = await getStatus('test-key', {
        networkId: 'testnet04',
        chainId: '0',
      });

      expect(result).toEqual(response);

      expect(chainwebClient.poll).toBeCalledTimes(1);
    });
  });

  describe('listen', () => {
    it('calls /listen endpoint get the status of the request', async () => {
      const response = { reqKey: 'test-key' };

      (chainwebClient.listen as jest.Mock).mockResolvedValue(response);

      const { listen } = getClient();

      const result = await listen('test-key', {
        networkId: 'testnet04',
        chainId: '0',
      });

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.listen).toBeCalledTimes(1);
    });
  });

  describe('getSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      const response = 'proof';

      (chainwebClient.spv as jest.Mock).mockResolvedValue(response);

      const { createSpv: getSpv } = getClient();

      const result = await getSpv('test-key', '2', {
        networkId: 'testnet04',
        chainId: '0',
      });

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

      const { pollCreateSpv: pollSpv } = getClient();

      const result = await pollSpv('test-key', '2', {
        interval: 10,
        networkId: 'testnet04',
        chainId: '0',
      });

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.spv).toBeCalledTimes(4);
    });
  });
});
