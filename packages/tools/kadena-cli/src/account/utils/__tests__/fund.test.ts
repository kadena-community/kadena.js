import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import { fund } from '../fund.js';
import { testNetworkConfigMock } from './mocks.js';

describe('fund', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  it('should fund an account when account already exists', async () => {
    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
        alias: 'my_testnet.yaml',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainId: '1',
    });
    expect(result).toStrictEqual({
      success: true,
      data: {
        chainId: '1',
        networkId: 'testnet04',
        requestKey: 'requestKey-1',
      },
    });
  });

  it('should create and fund an account when account does not exist', async () => {
    // Mock the account details as unavailable in the chain
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json(
            {
              result: {
                data: undefined,
                status: 'success',
              },
            },
            { status: 200 },
          );
        },
      ),
    );

    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
        alias: 'my_testnet.yaml',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainId: '1',
    });
    expect(result).toStrictEqual({
      success: true,
      data: {
        chainId: '1',
        networkId: 'testnet04',
        requestKey: 'requestKey-1',
      },
    });
  });

  it('should return success false and error message when account details api throws an error', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json(
            { error: 'something went wrong' },
            { status: 500 },
          );
        },
      ),
    );

    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
        alias: 'my_testnet.yaml',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainId: '1',
    });

    expect(result).toStrictEqual({
      success: false,
      errors: ['{"error":"something went wrong"}'],
    });
  });

  it('should return success false and error message when transfer fund api status returns failure', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/send',
        () => {
          return HttpResponse.json(
            { error: 'something went wrong' },
            { status: 500 },
          );
        },
      ),
    );

    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
        alias: 'my_testnet.yaml',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainId: '1',
    });

    expect(result).toStrictEqual({
      success: false,
      errors: ['Failed to transfer fund : "{"error":"something went wrong"}"'],
    });
  });
});
