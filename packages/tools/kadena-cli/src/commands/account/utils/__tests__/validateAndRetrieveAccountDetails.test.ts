import { HttpResponse, http } from 'msw';
import { afterEach, describe, expect, it } from 'vitest';

import { defaultConfigMock } from './mocks.js';

import { server } from '../../../../mocks/server.js';
import { validateAndRetrieveAccountDetails } from '../validateAndRetrieveAccountDetails.js';

describe('validateAndRetrieveAccountDetails', () => {
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
      accountName: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
      accountDetails: {
        guard: {
          keys: ['publicKey1', 'publicKey2'],
          pred: 'keys-all',
        },
        account: 'accountName',
        balance: 0,
      },
      isConfigAreSame: true,
    };
    const result = await validateAndRetrieveAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return config when account name is passed and userInput config and account details are same', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['publicKey1'],
      accountName: 'accountName',
    };

    const expectedResult = {
      accountName: 'accountName',
      accountDetails: {
        guard: {
          keys: ['publicKey1', 'publicKey2'],
          pred: 'keys-all',
        },
        account: 'accountName',
        balance: 0,
      },
      isConfigAreSame: false,
    };

    const result = await validateAndRetrieveAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return accountDetails as undefined when user data not found in chain', async () => {
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
      accountName: 'accountName',
      accountDetails: undefined,
      isConfigAreSame: true,
    };

    const result = await validateAndRetrieveAccountDetails(config);
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

    await expect(async () => {
      await validateAndRetrieveAccountDetails(config);
    }).rejects.toThrow('something went wrong');
  });
});
