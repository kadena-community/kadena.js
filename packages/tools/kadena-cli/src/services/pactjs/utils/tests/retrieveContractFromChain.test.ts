import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { services } from '../../../index.js';

const httpHandlers = [
  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact/api/v1/local',
    () =>
      HttpResponse.json({
        result: { status: 'success', data: { code: 'some pactCode' } },
      }),
  ),
  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/local',
    () => HttpResponse.text('Error'),
  ),
];

const server = setupServer(...httpHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('retrieveContractFromChain', () => {
  it('returns the pactCode on success', async () => {
    const result = await services.pactjs.retrieveContractFromChain(
      'free.crankk01',
      0,
      'mainnet',
      {
        network: 'mainnet',
        networkId: 'mainnet01',
        networkHost: 'https://api.chainweb.com',
        networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
      },
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
    );

    expect(result).toBe('some pactCode');
  });
  it('Undefined result if unable to return JSON.', async () => {
    await expect(() =>
      services.pactjs.retrieveContractFromChain(
        'free.crankk01',
        0,
        'mainnet',
        {
          network: 'mainnet',
          networkId: 'mainnet01',
          networkHost: 'https://api.chainweb.com',
          networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
        },
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact',
      ),
    ).rejects.toBeTruthy();
  });
});
