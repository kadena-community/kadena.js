import { describe, expect, it } from 'vitest';

import { defaultConfigMock } from './mocks.js';

import { validateAccountDetails } from '../validateAccountDetails.js';

describe('validateAccountDetails', () => {
  it('should return config and accountDetails from chain when config account name is empty', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['publicKey1', 'publicKey2'],
      accountName: undefined,
    };
    const expectedResult = {
      config: {
        ...config,
        accountName: 'w:FxlQEvb6qHb50NClEnpwbT2uoJHuAu39GTSwXmASH2k:keys-all',
      },
      accountDetails: {
        publicKeys: ['publicKey1', 'publicKey2'],
        predicate: 'keys-all',
      },
      isConfigAreSame: true,
    };
    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });

  it('should return updated config when account name is passed and userInput config and account details are same', async () => {
    const config = {
      ...defaultConfigMock,
      publicKeysConfig: ['publicKey1'],
      accountName: 'accountName',
    };

    const expectedResult = {
      config: {
        ...config,
        accountName: 'accountName',
      },
      accountDetails: {
        publicKeys: ['publicKey1', 'publicKey2'],
        predicate: 'keys-all',
      },
      isConfigAreSame: false,
    };

    const result = await validateAccountDetails(config);
    expect(result).toEqual(expectedResult);
  });
});
