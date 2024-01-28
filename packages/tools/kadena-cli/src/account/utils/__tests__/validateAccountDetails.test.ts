import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { defaultConfigMock } from './mocks.js';

import { server } from '../../../mocks/server.js';
import { validateAccountDetails } from '../validateAccountDetails.js';

describe('validateAccountDetails', () => {
  afterEach(() => {
    server.resetHandlers();
  });
  it('should return configWithAccountName from chain and accountDetails from chain when config account name is empty', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountName: undefined,
    };
    const expectedResult = {
      data: {
        config: {
          ...config,
          accountName: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
        },
        accountDetails: {
          publicKeys: ['publicKey1', 'publicKey2'],
          predicate: 'keys-all',
        },
        isConfigAreSame: true,
      },
      success: true,
    };
    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return config when account name is passed and userInput config and account details are same', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['publicKey1'],
      accountName: 'accountName',
    };

    const expectedResult = {
      data: {
        config: {
          ...config,
          accountName: 'accountName',
        },
        accountDetails: {
          publicKeys: ['publicKey1', 'publicKey2'],
          predicate: 'keys-all',
        },
        isConfigAreSame: false,
      },
      success: true,
    };

    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return error message account not found when account is not found in chain', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return new HttpResponse('row not found in chain', { status: 404 });
        },
      ),
    );
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
    };

    const expectedResult = {
      errors: [
        'The account is not on chain yet. To create it on-chain, transfer funds to it from testnet and use "fund" command.',
      ],
      success: false,
    };

    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return error message when chain api calls fails', async () => {
    server.use(
      http.post(
        'https://api.testnet.chainweb.com/chainweb/0.0/testnet04/chain/1/pact/api/v1/local',
        () => {
          return new HttpResponse('something went wrong', { status: 500 });
        },
      ),
    );
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
    };

    const expectedResult = {
      errors: ['something went wrong'],
      success: false,
    };

    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });
});
