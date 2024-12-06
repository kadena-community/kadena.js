import type * as ChainWebNodeClient from '@kadena/chainweb-node-client';
import { local } from '@kadena/chainweb-node-client';
import type { ChainId } from '@kadena/types';
import { http, HttpResponse } from 'msw';
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
import { createClient } from '../client';

// Hack to spy on exported function
vi.mock('@kadena/chainweb-node-client', async (importOriginal) => {
  const mod: typeof ChainWebNodeClient = await importOriginal();
  const local = vi.fn().mockImplementation(mod.local);
  return { ...mod, local };
});

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
      const expectedResponse = {
        reqKey: 'test-key',
        result: 'test-result',
      };
      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/local', expectedResponse),
      );

      const { local } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      const res = await local(body);
      expect(res).toEqual(expectedResponse);
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

    it('returns a list if input is list of requests', async () => {
      const response = [
        // first /poll
        {},
        // second /poll
        {},
        // third /poll
        {
          'test-key-1': { reqKey: 'test-key-1' },
          'test-key-2': { reqKey: 'test-key-2' },
        },
      ];

      server.resetHandlers(
        post('http://example.org/mainnet01/1/api/v1/send', {
          requestKeys: ['test-key-1', 'test-key-2'],
        }),
        post('http://example.org/mainnet01/1/api/v1/poll', response[0]),
        post('http://example.org/mainnet01/1/api/v1/poll', response[1]),
        post('http://example.org/mainnet01/1/api/v1/poll', response[2]),
      );

      const { submit, pollStatus } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = [
        {
          cmd: JSON.stringify({ networkId, meta: { chainId } }),
          hash: 'hash',
          sigs: [{ sig: 'test-sig' }],
        },
        {
          cmd: JSON.stringify({ networkId, meta: { chainId } }),
          hash: 'hash',
          sigs: [{ sig: 'test-sig' }],
        },
      ];

      const transactionDescriptor = await submit(body);

      expect(transactionDescriptor.length).toEqual(2);

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

    it('calls /poll endpoint once to get the status of the list of requests ', async () => {
      server.resetHandlers(
        post(
          'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/0/pact/api/v1/poll',
          { 'test-key-1': 'result1', 'test-key-2': 'result2' },
        ),
      );

      const { getStatus } = createClient();

      const result = await getStatus([
        {
          requestKey: 'test-key-1',
          chainId: '0',
          networkId: 'testnet04',
        },
        { requestKey: 'test-key-2', chainId: '0', networkId: 'testnet04' },
      ]);

      expect(result).toEqual({
        'test-key-1': 'result1',
        'test-key-2': 'result2',
      });
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

  describe('preflight', () => {
    it('uses local request and add preflight=true and signatureVerification=true', async () => {
      const expectedResponse = {
        reqKey: 'test-key',
        result: 'test-result',
      };
      server.resetHandlers(
        post(
          'http://example.org/mainnet01/1/api/v1/local?preflight=true&signatureVerification=true',
          expectedResponse,
        ),
      );

      const { preflight } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      expect(await preflight(body)).toEqual(expectedResponse);
    });
  });
  describe('signatureVerification', () => {
    it('uses local request and add preflight=false and signatureVerification=true', async () => {
      const expectedResponse = {
        reqKey: 'test-key',
        result: 'test-result',
      };
      server.resetHandlers(
        post(
          'http://example.org/mainnet01/1/api/v1/local?preflight=false&signatureVerification=true',
          expectedResponse,
        ),
      );

      const { signatureVerification } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      expect(await signatureVerification(body)).toEqual(expectedResponse);
    });
  });

  describe('dirtyRead', () => {
    it('uses local request and add preflight=false and signatureVerification=false', async () => {
      const expectedResponse = {
        reqKey: 'test-key',
        result: 'test-result',
      };
      server.resetHandlers(
        post(
          'http://example.org/mainnet01/1/api/v1/local?preflight=false&signatureVerification=false',
          expectedResponse,
        ),
      );

      const { dirtyRead } = createClient(hostApiGenerator);

      const networkId = 'mainnet01';
      const chainId = '1';

      const body = {
        cmd: JSON.stringify({ networkId, meta: { chainId } }),
        hash: 'hash',
        sigs: [{ sig: 'test-sig' }],
      };

      expect(await dirtyRead(body)).toEqual(expectedResponse);
    });
  });

  describe('runPact', () => {
    beforeAll(() => {
      vi.useFakeTimers().setSystemTime(new Date('2023-07-31'));
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it('create a complete pact command from the input and send it to the chain', async () => {
      const { runPact } = createClient(hostApiGenerator);
      const mockResponse = {};

      server.resetHandlers(
        http.post(
          'http://example.org/mainnet01/1/api/v1/local?preflight=false&signatureVerification=false',
          () => HttpResponse.json(mockResponse),
          { once: true },
        ),
      );

      const result = await runPact(
        '(+ 1 1)',
        { testData: 'testData' },
        {
          networkId: 'mainnet01',
          chainId: '1',
        },
      );

      expect(result).toStrictEqual(mockResponse);

      expect(local).toBeCalledWith(
        {
          cmd: '{"payload":{"exec":{"code":"(+ 1 1)","data":{"testData":"testData"}}},"nonce":"kjs:nonce:1690761600000","signers":[]}',
          hash: '4KHg5lsf4zxOXsaqbvNIJlVPKXDtuzi3xiSlRUnqBJQ',
          sigs: [],
        },
        'http://example.org/mainnet01/1',
        {
          preflight: false,
          signatureVerification: false,
          chainId: '1',
          networkId: 'mainnet01',
        },
      );
    });
  });
});
