import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { retrieveContractFromChain } from '../retrieveContractFromChain';

const httpHandlers = [
  http.post(
    'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact/api/v1/local',
    () => HttpResponse.json({ result: { data: { code: 'some pactCode' } } }),
  ),
];

const server = setupServer(...httpHandlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('retrieveContractFromChain', () => {
  it('returns the pactCode on success', async () => {
    const result = await retrieveContractFromChain(
      'free.crankk01',
      'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/8/pact',
      0,
      'mainnet',
    );

    expect(result).toBe('some pactCode');
  });
});
