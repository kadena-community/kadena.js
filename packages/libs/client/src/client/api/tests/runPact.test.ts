import type * as ChainWebNodeClient from '@kadena/chainweb-node-client';
import { local } from '@kadena/chainweb-node-client';
import { HttpResponse, http } from 'msw';
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
import { runPact } from '../runPact';

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

describe('runPact', () => {
  beforeAll(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-07-31'));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('create a complete pact command from the input and send it to the chain', async () => {
    const mockResponse = {};

    server.resetHandlers(
      http.post(
        'http://blockchain/api/v1/local',
        () => HttpResponse.json(mockResponse),
        { once: true },
      ),
    );

    const result = await runPact('http://blockchain', '(+ 1 1)');

    expect(result).toStrictEqual(mockResponse);

    expect(local).toBeCalledWith(
      {
        cmd: '{"payload":{"exec":{"code":"(+ 1 1)","data":{}}},"nonce":"kjs:nonce:1690761600000","signers":[]}',
        hash: 'BFstB5srkwenVbxQYjMsdSIQiyaakhaYGjHA3ZKmntY',
        sigs: [],
      },
      'http://blockchain',
      { preflight: false, signatureVerification: false },
    );
  });
});
