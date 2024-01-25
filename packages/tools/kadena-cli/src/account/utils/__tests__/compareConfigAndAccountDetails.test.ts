import { describe, expect, it } from 'vitest';

import type { IAccountDetailsResult } from '../../types.js';
import { compareConfigAndAccountDetails } from '../compareConfigAndAccountDetails.js';
import { defaultConfigMock } from './mocks.js';

describe('compareConfigAndAccountDetails', () => {
  it('should return true when config guards and account details are equal', () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'test',
      publicKeysConfig: ['test'],
    };
    const accountDetails: IAccountDetailsResult = {
      publicKeys: ['test'],
      predicate: 'keys-all',
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(true);
  });

  it('should return false when config and account details public keys are same but predicate are different', () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'test',
      publicKeysConfig: ['test'],
    };
    const accountDetails: IAccountDetailsResult = {
      publicKeys: ['test'],
      predicate: 'keys-any',
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(false);
  });

  it('should return false when config and account details predicate are same but public keys are different', () => {
    const config = {
      ...defaultConfigMock,
      publicKeys: 'test',
      publicKeysConfig: ['test'],
    };
    const accountDetails: IAccountDetailsResult = {
      publicKeys: ['test', 'test2'],
      predicate: 'keys-all',
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(false);
  });
});
