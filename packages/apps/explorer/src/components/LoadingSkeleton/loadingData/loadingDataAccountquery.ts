import type { AccountQuery } from '@/__generated__/sdk';
import { CONSTANTS } from '@/constants/constants';

export const loadingData: AccountQuery = {
  fungibleAccount: {
    accountName: '0',
    totalBalance: 0,
    chainAccounts: Array(CONSTANTS.CHAINCOUNT).fill({
      chainId: '0',
      balance: 0,
      guard: {
        keys: ['0'],
        predicate: '0',
      },
    }),
  },
};
