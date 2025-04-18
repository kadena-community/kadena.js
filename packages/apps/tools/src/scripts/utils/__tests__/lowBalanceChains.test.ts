import type { IAccount } from '../../constants';
import { lowBalanceChains } from '../lowBalanceChains';

describe('Utils', () => {
  describe('lowBalanceChains', () => {
    it('should return an empty array when chainAccounts is empty', () => {
      const result = lowBalanceChains(undefined, 1500);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts is empty array', () => {
      const result = lowBalanceChains([], 1500);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts balances are all high enough', () => {
      const chains = [
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 3000,
          chainId: '1',
        },
        {
          balance: 2000,
          chainId: '2',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ];

      const result = lowBalanceChains(chains, 50);
      expect(result).toEqual([]);
    });

    it('should return an array of 2 found chains that have balance lower than mininmum', () => {
      const chains = [
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 3000,
          chainId: '1',
        },
        {
          balance: 2000,
          chainId: '2',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ];

      const result = lowBalanceChains(chains, 2000);
      expect(result.length).toEqual(2);
      expect(result).toEqual([
        {
          balance: 1000,
          chainId: '0',
        },
        {
          balance: 1500,
          chainId: '3',
        },
      ]);
    });
  });
});
