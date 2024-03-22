import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { createAccountOnMainnet } from '../createAccountOnMainnet.js';

describe('createAccountOnMainnet', () => {
  beforeEach(() => {
    server.resetHandlers();
  });
  it('should create an account on mainnet', async () => {
    const result = await createAccountOnMainnet({
      accountName: 'testAccount',
      publicKeys: ['publicKey-1'],
      predicate: 'keys-all',
      chainId: '1',
      fungible: 'coin',
    });
    expect(result).toEqual({
      data: 'testAccount',
      status: 'success',
    });
  });

  it('should return result success false when there is any error on network call', async () => {
    // Mock the account details as unavailable in the chain
    server.use(
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/listen',
        () => {
          return HttpResponse.json(
            {
              result: {
                status: 'failure',
                error: {
                  message: 'something went wrong',
                },
              },
            },
            { status: 200 },
          );
        },
      ),
    );
    const result = await createAccountOnMainnet({
      accountName: 'testAccount',
      publicKeys: ['publicKey-1'],
      predicate: 'keys-all',
      chainId: '1',
      fungible: 'coin',
    });
    expect(result).toEqual({
      errors: ['something went wrong'],
      status: 'error',
    });
  });

  it('should return account doesnot exist on chain error when row found error message happens', async () => {
    server.use(
      http.post(
        'https://api.chainweb.com/chainweb/0.0/mainnet01/chain/1/pact/api/v1/listen',
        () => {
          return HttpResponse.json(
            {
              result: {
                status: 'failure',
                error: {
                  message: 'row found',
                },
              },
            },
            { status: 200 },
          );
        },
      ),
    );
    const result = await createAccountOnMainnet({
      accountName: 'testAccount',
      publicKeys: ['publicKey-1'],
      predicate: 'keys-all',
      chainId: '1',
      fungible: 'coin',
    });
    expect(result).toStrictEqual({
      errors: ['Account "testAccount" already exists on chain "1"'],
      status: 'error',
    });
  });
});
