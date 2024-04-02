import type { ChainId } from '@kadena/types';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createClient } from '../client';

const server = setupServer();
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const post = (
  path: string,
  response: string | Record<string, unknown>,
  status = 200,
): ReturnType<typeof http.post> =>
  http.post(
    path,
    () =>
      typeof response === 'string'
        ? new HttpResponse(response, { status })
        : HttpResponse.json(response, { status }),
    { once: true },
  );

const hostApiGenerator = ({
  networkId,
  chainId,
}: {
  networkId: string;
  chainId: ChainId;
}): string => `http://example.org/${networkId}/${chainId}`;

describe('client', () => {
  it('uses the string input as the host for all requests', async () => {
    const response = { reqKey: 'test-key' };

    server.resetHandlers(
      post('http://test-blockchain-host.com/api/v1/local', response),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const { local } = createClient(hostUrl);

    const body = {
      cmd: JSON.stringify({ networkId: 'mainnet01', meta: { chainId: '1' } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    const result = await local(body);

    expect(result).toEqual(response);
  });

  it('uses kadenaHostGenerator if called without argument', async () => {
    server.resetHandlers(
      post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/local',
        { reqKey: 'test-key' },
      ),
    );

    const { local } = createClient();

    const networkId = 'mainnet01';
    const chainId = '1';

    const body = {
      cmd: JSON.stringify({ networkId, meta: { chainId } }),
      hash: 'hash',
      sigs: [{ sig: 'test-sig' }],
    };

    await local(body);
  });

  it("uses confirmationDepth that is passed as an argument to the 'client' function for the applicable places", async () => {
    server.resetHandlers(
      http.post('http://example.org/mainnet01/1/api/v1/poll', ({ request }) => {
        const url = new URL(request.url);
        return HttpResponse.json({
          'test-key': {
            reqKey: 'test-key',
            confirmationDepth: url.searchParams.get('confirmationDepth'),
          },
        });
      }),
    );

    const { pollOne } = createClient(hostApiGenerator, {
      confirmationDepth: 4,
    });

    const result = await pollOne({
      requestKey: 'test-key',
      networkId: 'mainnet01',
      chainId: '1',
    });

    expect(result).toEqual({ reqKey: 'test-key', confirmationDepth: '4' });
  });

  describe('pollOne', () => {
    it("used the confirmationDepth that is passed as an argument to the 'pollOne' function", async () => {
      server.resetHandlers(
        http.post(
          'http://example.org/mainnet01/1/api/v1/poll',
          ({ request }) => {
            const url = new URL(request.url);
            return HttpResponse.json({
              'test-key': {
                reqKey: 'test-key',
                confirmationDepth: url.searchParams.get('confirmationDepth'),
              },
            });
          },
        ),
      );

      const { pollOne } = createClient(hostApiGenerator, {
        confirmationDepth: 4,
      });

      const result = await pollOne(
        {
          requestKey: 'test-key',
          networkId: 'mainnet01',
          chainId: '1',
        },
        {
          confirmationDepth: 5,
        },
      );
      expect(result).toEqual({ reqKey: 'test-key', confirmationDepth: '5' });
    });
  });

  describe('local', () => {
    it('uses the hostApiGenerator function to generate hostUrl for local request', async () => {
      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/local', {
          reqKey: 'test-key',
        }),
      );

      const { local } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      await local(body);
    });
  });

  describe('submit', () => {
    it('uses the hostApiGenerator function to generate hostUrl for submit request', async () => {
      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/send', {
          requestKeys: ['test-key'],
        }),
      );

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

    it('returns requestKey if input is a single command', async () => {
      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/send', {
          requestKeys: ['test-key'],
        }),
      );

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
      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/send', {
          requestKeys: ['test-key'],
        }),
      );

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

      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/send', {
          requestKeys: ['test-key'],
        }),
        post('http://example.org/mainnet01/1/api/v1/poll', response[0]),
        post('http://example.org/mainnet01/1/api/v1/poll', response[1]),
        post('http://example.org/mainnet01/1/api/v1/poll', response[2]),
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
    });
  });

  describe('getStatus', () => {
    it('calls /poll endpoint once to get the status of the request', async () => {
      server.resetHandlers(
        post(
          'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/poll',
          {},
        ),
      );

      const { getStatus } = createClient();

      const result = await getStatus({
        requestKey: 'test-key',
        chainId: '0',
        networkId: 'testnet04',
      });

      expect(result).toEqual({});
    });
  });

  describe('listen', () => {
    it('calls /listen endpoint get the status of the request', async () => {
      server.resetHandlers(
        post(
          'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/listen',
          { reqKey: 'test-key' },
        ),
      );

      const { listen } = createClient();

      const result = await listen({
        requestKey: 'test-key',
        chainId: '0',
        networkId: 'testnet04',
      });

      expect(result).toEqual({ reqKey: 'test-key' });
    });
  });

  describe('getSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      server.resetHandlers(
        post(
          'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/spv',
          'proof',
        ),
      );

      const { createSpv: getSpv } = createClient();

      const result = await getSpv(
        {
          requestKey: 'test-key',
          chainId: '0',
          networkId: 'testnet04',
        },
        '2',
      );

      expect(result).toEqual('proof');
    });
  });

  describe('pollSpv', () => {
    it('calls /spv endpoint once to get spv proof', async () => {
      server.resetHandlers(
        post('http://test-host.com/spv', 'not found', 404),
        post('http://test-host.com/spv', 'not found', 404),
        post('http://test-host.com/spv', 'not found', 404),
        post('http://test-host.com/spv', 'proof'),
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

      expect(result).toEqual('proof');
    });
  });
});
