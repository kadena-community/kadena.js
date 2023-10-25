import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { getSpv, pollSpv } from '../spv';

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

describe('getSpv', () => {
  it('calls /spv endpoint to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    server.resetHandlers(post('http://test-blockchain-host.com/spv', response));

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await getSpv(hostUrl, requestKey, targetChainId);

    expect(result).toBe(response);
  });

  it('throws exception if spv function does not return string', async () => {
    server.resetHandlers(
      post(
        'http://test-blockchain-host.com/spv',
        'PROOF_IS_NOT_AVAILABLE',
        500,
      ),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    await expect(() =>
      getSpv(hostUrl, requestKey, targetChainId),
    ).rejects.toThrowError(new Error('PROOF_IS_NOT_AVAILABLE'));
  });
});

describe('pollSpv', () => {
  it('calls /spv endpoint several times to generate spv for a request and a target chain', async () => {
    const response = 'spv-proof';

    server.resetHandlers(
      post('http://test-blockchain-host.com/spv', 'not found', 404),
      post('http://test-blockchain-host.com/spv', 'not found', 404),
      post('http://test-blockchain-host.com/spv', 'not found', 404),
      post('http://test-blockchain-host.com/spv', 'not found', 404),
      post('http://test-blockchain-host.com/spv', response),
    );

    const hostUrl = 'http://test-blockchain-host.com';

    const requestKey = 'request-key';
    const targetChainId = '1';

    const result = await pollSpv(hostUrl, requestKey, targetChainId, {
      interval: 10,
    });

    expect(result).toBe(response);
  });
});
