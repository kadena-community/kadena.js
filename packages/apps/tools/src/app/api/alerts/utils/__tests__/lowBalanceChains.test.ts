import { CHAINS } from '@kadena/chainweb-node-client';
import type { IAlert } from '../constants';
import { lowBalanceChains } from '../lowBalanceChains';

describe('Utils', () => {
  describe('lowBalanceChains', () => {
    it('should return an empty array when chainAccounts is empty', () => {
      const alert = {
        chainIds: CHAINS,
        options: {
          minBalance: 1500,
        },
      } as unknown as IAlert;

      const result = lowBalanceChains(alert, undefined);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts is empty array', () => {
      const alert = {
        chainIds: CHAINS,
        options: {
          minBalance: 1500,
        },
      } as unknown as IAlert;

      const result = lowBalanceChains(alert, []);
      expect(result).toEqual([]);
    });
    it('should return an empty array when chainAccounts balances are all high enough', () => {
      const alert = {
        chainIds: CHAINS,
        options: {
          minBalance: 50,
        },
      } as unknown as IAlert;

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

      const result = lowBalanceChains(alert, chains);
      expect(result).toEqual([]);
    });

    it('should return an array of 2 found chains that have balance lower than mininmum', () => {
      const alert = {
        chainIds: CHAINS,
        options: {
          minBalance: 2000,
        },
      } as unknown as IAlert;

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

      const result = lowBalanceChains(alert, chains);
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
