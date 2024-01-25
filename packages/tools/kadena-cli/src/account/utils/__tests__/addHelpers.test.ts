import { describe, expect, it } from 'vitest';
import { getUpdatedConfig } from '../addHelpers.js';
import { defaultConfigMock } from './mocks.js';

describe('getUpdatedConfig', () => {
  it('should return config when updateOption is "userInput"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails = {
      publicKeys: ['publicKeys'],
      predicate: 'keys-all',
    };
    const updateOption = 'userInput';
    const result = getUpdatedConfig(config, accountDetails, updateOption);
    expect(result).toEqual(config);
  });

  it('should return updated config when updateOption is "chain"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails = {
      publicKeys: ['publicKeys'],
      predicate: 'keys-any',
    };
    const updateOption = 'chain';
    const expectedResult = {
      ...config,
      predicate: 'keys-any',
    };

    const result = getUpdatedConfig(config, accountDetails, updateOption);
    expect(result).toEqual(expectedResult);
  });
});
