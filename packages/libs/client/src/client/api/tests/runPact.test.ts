import type * as ChainWebNodeClient from '@kadena/chainweb-node-client';
import { local } from '@kadena/chainweb-node-client';

import { runPact } from '../runPact';

import { rest } from 'msw';
import { setupServer } from 'msw/node';

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

    vi.useFakeTimers().setSystemTime(new Date('2023-07-31'));

describe('runPact', () => {
  it('create a complete pact command from the input and send it to the chain', async () => {
    const mockResponse = {};

    server.resetHandlers(
      rest.post('http://blockchain/api/v1/local', (req, res, ctx) =>
        res.once(ctx.status(200), ctx.json(mockResponse)),
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
