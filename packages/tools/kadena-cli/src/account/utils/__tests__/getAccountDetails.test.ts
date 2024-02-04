import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';
import { server } from '../../../mocks/server.js';
import {
  getAccountDetailsForAddAccount,
  getAccountDetailsFromChain,
} from '../getAccountDetails.js';
import { devNetConfigMock } from './mocks.js';

describe('getAccountDetailsFromChain', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account details from chain when account is available on chain', async () => {
    const result = await getAccountDetailsFromChain({
      accountName: 'accountName',
      chainId: '1',
      networkId: devNetConfigMock.networkId,
      networkHost: devNetConfigMock.networkHost,
      fungible: 'coin',
    });

    const expectedResult = {
      guard: {
        keys: ['publicKey1', 'publicKey2'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should throw an error when account details are undefined from chain', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
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
    await expect(async () => {
      await getAccountDetailsFromChain({
        accountName: 'k:accountName',
        chainId: '1',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('Account k:accountName: row not found.');
  });

  it('should throw an error when account is not available on chain', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json({ error: 'row not found' }, { status: 404 });
        },
      ),
    );
    await expect(async () => {
      await getAccountDetailsFromChain({
        accountName: 'k:accountName',
        chainId: '1',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('{"error":"row not found"}');
  });
});

describe('getAccountDetailsForAddAccount', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account details from chain when account is available on chain', async () => {
    const result = await getAccountDetailsForAddAccount({
      accountName: 'accountName',
      chainId: '1',
      networkId: devNetConfigMock.networkId,
      networkHost: devNetConfigMock.networkHost,
      fungible: 'coin',
    });

    const expectedResult = {
      guard: {
        keys: ['publicKey1', 'publicKey2'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    expect(result).toStrictEqual(expectedResult);
  });

  it('should return undefined when account details throws an error with row not found', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json({ error: 'row not found' }, { status: 404 });
        },
      ),
    );
    const result = await getAccountDetailsForAddAccount({
      accountName: 'k:accountName',
      chainId: '1',
      networkId: devNetConfigMock.networkId,
      networkHost: devNetConfigMock.networkHost,
      fungible: 'coin',
    });
    expect(result).toBe(undefined);
  });

  it('should throw an error when account details throws an error', async () => {
    server.use(
      http.post(
        'https://localhost:8080/chainweb/0.0/fast-development/chain/1/pact/api/v1/local',
        () => {
          return HttpResponse.json(
            { error: 'something went wrong' },
            { status: 500 },
          );
        },
      ),
    );
    await expect(async () => {
      await getAccountDetailsForAddAccount({
        accountName: 'k:accountName',
        chainId: '1',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('{"error":"something went wrong"}');
  });
});
