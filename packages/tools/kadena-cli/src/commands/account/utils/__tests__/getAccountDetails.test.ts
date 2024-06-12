import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { accountDetailsSuccessData } from '../../../../mocks/data/accountDetails.js';
import {
  devNetConfigMock,
  testNetworkConfigMock,
} from '../../../../mocks/network.js';
import { server, useMswHandler } from '../../../../mocks/server.js';
import {
  getAccountDetails,
  getAccountDetailsFromChain,
} from '../getAccountDetails.js';

describe('getAccountDetailsFromChain', () => {
  beforeEach(() => {
    useMswHandler({
      network: devNetConfigMock,
      response: accountDetailsSuccessData,
    });
  });

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
    useMswHandler({
      network: devNetConfigMock,
      response: {
        result: {
          data: undefined,
          status: 'success',
        },
      },
      chainId: '2',
    });
    await expect(async () => {
      await getAccountDetailsFromChain({
        accountName: 'k:accountName',
        chainId: '2',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('Account k:accountName: row not found.');
  });

  it('should throw an error when account is not available on chain', async () => {
    useMswHandler({
      network: devNetConfigMock,
      response: { error: 'row not found' },
      chainId: '2',
      status: 404,
    });
    await expect(async () => {
      await getAccountDetailsFromChain({
        accountName: 'k:accountName',
        chainId: '2',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('{"error":"row not found"}');
  });
});

describe('getAccountDetails', () => {
  beforeEach(() => {
    useMswHandler({
      network: devNetConfigMock,
      response: accountDetailsSuccessData,
    });
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should return account details from chain when account is available on chain', async () => {
    const result = await getAccountDetails({
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
    useMswHandler({
      network: testNetworkConfigMock,
      response: { error: 'row not found' },
      chainId: '10',
      status: 404,
    });

    const result = await getAccountDetails({
      accountName: 'k:accountName',
      chainId: '10',
      networkId: testNetworkConfigMock.networkId,
      networkHost: testNetworkConfigMock.networkHost,
      fungible: 'coin',
    });
    expect(result).toBe(undefined);
  });

  it('should throw an error when account details throws an error', async () => {
    useMswHandler({
      network: devNetConfigMock,
      response: { error: 'something went wrong' },
      status: 500,
    });
    await expect(async () => {
      await getAccountDetails({
        accountName: 'k:accountName',
        chainId: '1',
        networkId: devNetConfigMock.networkId,
        networkHost: devNetConfigMock.networkHost,
        fungible: 'coin',
      });
    }).rejects.toThrow('{"error":"something went wrong"}');
  });
});
