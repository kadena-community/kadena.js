import * as inquirerPrompts from '@inquirer/prompts';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IAccountDetailsResult } from '../../types.js';
import { getUpdatedConfig, overridePromptCb } from '../addHelpers.js';
import { defaultConfigMock } from './mocks.js';

describe('overridePromptCallback', () => {
  vi.mock('@inquirer/prompts');
  beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
  });

  it('should return true when user select "chain"', async () => {
    const selectSpy = vi
      .spyOn(inquirerPrompts, 'select')
      .mockResolvedValue('chain');
    const result = await overridePromptCb();
    expect(selectSpy).toHaveBeenCalledOnce();
    expect(result).toBe(true);
  });

  it('should return false when user select "userInput"', async () => {
    const selectSpy = vi
      .spyOn(inquirerPrompts, 'select')
      .mockResolvedValue('userInput');
    const result = await overridePromptCb();
    expect(selectSpy).toHaveBeenCalledOnce();
    expect(result).toBe(false);
  });
});

describe('getUpdatedConfig', () => {
  it('should return config when updateOption is overrideFromChain is "false"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails: IAccountDetailsResult = {
      publicKeys: ['publicKeys'],
      predicate: 'keys-all',
    };
    const overrideFromChain = false;
    const result = getUpdatedConfig(config, accountDetails, overrideFromChain);
    expect(result).toEqual(config);
  });

  it('should return updated config when overrideFromChain is "true"', () => {
    const config = {
      ...defaultConfigMock,
      accountName: 'accountName',
      publicKeys: 'publicKeys',
      publicKeysConfig: ['publicKeys'],
    };
    const accountDetails: IAccountDetailsResult = {
      publicKeys: ['publicKeys'],
      predicate: 'keys-any',
    };
    const overrideFromChain = true;
    const expectedResult = {
      ...config,
      predicate: 'keys-any',
    };

    const result = getUpdatedConfig(config, accountDetails, overrideFromChain);
    expect(result).toEqual(expectedResult);
  });
});
