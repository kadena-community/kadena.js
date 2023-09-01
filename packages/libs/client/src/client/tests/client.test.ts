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
import { type ChainId } from '@kadena/types';

import { createClient } from '../client';
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

    const { local } = createClient(hostUrl);

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
    const { local } = createClient();

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

      const { local } = createClient(hostApiGenerator);

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

      const { submit } = createClient(hostApiGenerator);

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

      const { submit } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const transactionDescriptor = await submit(body);

      expect(transactionDescriptor).toEqual({
        requestKey: 'test-key',
        chainId: '1',
        networkId: 'mainnet01',
      });
    });

    it('returns requestKeys if input is an array', async () => {
      (chainwebClient.send as jest.Mock).mockResolvedValue({
        requestKeys: ['test-key'],
      });

      const { submit } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const transactionDescriptors = await submit([body]);

      expect(transactionDescriptors).toEqual([
        { requestKey: 'test-key', chainId: '1', networkId: 'mainnet01' },
      ]);
    });

    it('throes an error if the command list is empty', async () => {
      const { submit } = createClient(() => 'http://test-host.com');
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

      const { submit, pollStatus } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const transactionDescriptor = await submit(body);

      expect(transactionDescriptor.requestKey).toEqual('test-key');

      const result = await pollStatus(transactionDescriptor, {
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

      const { getStatus } = createClient();

      const result = await getStatus({
        requestKey: 'test-key',
        chainId: '0',
        networkId: 'testnet04',
      });

      expect(result).toEqual(response);

      expect(chainwebClient.poll).toBeCalledTimes(1);
    });
  });

  describe('listen', () => {
    it('calls /listen endpoint get the status of the request', async () => {
      const response = { reqKey: 'test-key' };

      (chainwebClient.listen as jest.Mock).mockResolvedValue(response);

      const { listen } = createClient();

      const result = await listen({
        requestKey: 'test-key',
        chainId: '0',
        networkId: 'testnet04',
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

      const { createSpv: getSpv } = createClient();

      const result = await getSpv(
        {
          requestKey: 'test-key',
          chainId: '0',
          networkId: 'testnet04',
        },
        '2',
      );

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

      const { pollCreateSpv: pollSpv } = createClient('http://test-host.com');

      const result = await pollSpv(
        {
          requestKey: 'test-key',
          chainId: '0',
          networkId: 'testnet04',
        },
        '2',
        { interval: 10 },
      );

      expect(result).toEqual(response);

      // one for the /send and three times /poll
      expect(chainwebClient.spv).toBeCalledTimes(4);
    });
  });
});
