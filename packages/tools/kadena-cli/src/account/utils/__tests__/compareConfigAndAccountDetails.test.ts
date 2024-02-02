import { describe, expect, it } from 'vitest';

import type { IAccountDetailsResult, IGuard } from '../../types.js';
import { compareConfigAndAccountDetails } from '../compareConfigAndAccountDetails.js';

describe('compareConfigAndAccountDetails', () => {
  it('should return true when config guards and account details are equal', () => {
    const config: IGuard = {
      keys: ['test'],
      pred: 'keys-all',
    };
    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: ['test'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(true);
  });

  it('should return false when config and account details public keys are same but predicate are different', () => {
    const config: IGuard = {
      keys: ['test'],
      pred: 'keys-any',
    };
    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: ['test'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(false);
  });

  it('should return false when config and account details predicate are same but public keys are different', () => {
    const config: IGuard = {
      keys: ['key1'],
      pred: 'keys-all',
    };
    const accountDetails: IAccountDetailsResult = {
      guard: {
        keys: ['test'],
        pred: 'keys-all',
      },
      account: 'accountName',
      balance: 0,
    };
    const result = compareConfigAndAccountDetails(config, accountDetails);
    expect(result).toBe(false);
  });
});
