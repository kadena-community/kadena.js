import { describe, expect, it } from 'vitest';
import type { IAccountDetailsResult } from '../../types.js';
import { getUpdatedConfig } from '../addHelpers.js';
import { defaultConfigMock } from './mocks.js';

describe('getUpdatedConfig', () => {
  it('should return config when updateOption is overwriteFromChain is "false"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: ['publicKeys'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    const overwriteFromChain = false;
    const result = getUpdatedConfig(config, accountDetails, overwriteFromChain);
    expect(result).toEqual(config);
  });

  it('should return updated config when overwriteFromChain is "true"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: ['publicKeys'],
        pred: 'keys-any',
      },
      account: 'accountName',
      balance: 0,
    };
    const overwriteFromChain = true;
    const expectedResult = {
      ...config,
      predicate: 'keys-any',
    };

    const result = getUpdatedConfig(config, accountDetails, overwriteFromChain);
    expect(result).toEqual(expectedResult);
  });

  it('should return config when accountDetails keys are empty', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };

    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: [],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };

    const overwriteFromChain = true;
    const result = getUpdatedConfig(config, accountDetails, overwriteFromChain);
    expect(result).toEqual(config);
  });
});
