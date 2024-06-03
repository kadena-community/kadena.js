import type { Mock } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { accountDetailsSuccessData } from '../../../../mocks/data/accountDetails.js';
import { server } from '../../../../mocks/server.js';
import { createAndTransferFund } from '../createAndTransferFunds.js';
import { fund } from '../fund.js';
import { getAccountDetails } from '../getAccountDetails.js';
import { transferFund } from '../transferFund.js';
import { testNetworkConfigMock } from './mocks.js';

vi.mock('../getAccountDetails.js', () => ({
  getAccountDetails: vi.fn(),
}));

vi.mock('../transferFund.js', () => ({
  transferFund: vi.fn(),
}));

vi.mock('../createAndTransferFunds.js', () => ({
  createAndTransferFund: vi.fn(),
}));

describe('fund', () => {
  beforeEach(() => {
    server.resetHandlers();
    (getAccountDetails as Mock).mockResolvedValue(
      accountDetailsSuccessData.result.data,
    );

    (transferFund as Mock).mockResolvedValue({
      requestKey: 'requestKey-1',
      chainId: '1',
      networkId: 'testnet04',
    });

    (createAndTransferFund as Mock).mockResolvedValue({
      requestKey: 'requestKey-1',
      chainId: '1',
      networkId: 'testnet04',
    });
  });

  it('should fund an account when account already exists', async () => {
    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainIds: ['1'],
    });
    expect(result).toStrictEqual({
      status: 'success',
      data: [
        {
          chainId: '1',
          networkId: 'testnet04',
          requestKey: 'requestKey-1',
        },
      ],
      errors: [],
      warnings: [],
    });
  });

  it('should create and fund an account when account does not exist', async () => {
    (getAccountDetails as Mock).mockResolvedValue(undefined);

    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainIds: ['1'],
    });
    expect(result).toStrictEqual({
      status: 'success',
      data: [
        {
          chainId: '1',
          networkId: 'testnet04',
          requestKey: 'requestKey-1',
        },
      ],
      errors: [],
      warnings: [
        'Account "accountName" does not exist on Chain ID(s) 1. So the account will be created on these Chain ID(s).',
      ],
    });
  });

  it('should return success false and error message when account details api throws an error', async () => {
    const error = new Error('{"error":"something went wrong"}');
    (getAccountDetails as Mock).mockRejectedValue(error);

    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainIds: ['1'],
    });

    expect(result).toStrictEqual({
      status: 'error',
      errors: [],
      data: [],
      warnings: ['Error on Chain ID 1 - {"error":"something went wrong"}'],
    });
  });

  it('should return success false and error message when api call fails', async () => {
    (transferFund as Mock).mockRejectedValue(
      new Error('Failed to transfer fund : "{"error":"something went wrong"}"'),
    );
    const result = await fund({
      accountConfig: {
        name: 'accountName',
        publicKeys: ['publicKey'],
        predicate: 'predicate',
        fungible: 'coin',
      },
      amount: '100',
      networkConfig: testNetworkConfigMock,
      chainIds: ['1'],
    });

    expect(result).toStrictEqual({
      status: 'error',
      data: [],
      errors: [],
      warnings: [
        'Error on Chain ID 1 - Failed to transfer fund : "{"error":"something went wrong"}"',
      ],
    });
  });
});
