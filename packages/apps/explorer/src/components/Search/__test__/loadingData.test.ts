import type { AccountTransactionsQuery } from '@/__generated__/sdk';
import { loadingData } from '../loadingDataSearch';

describe('loading data', () => {
  describe('loadingDataAccountTransactionsquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingData).toBeObject();

      expectTypeOf(loadingData).toMatchTypeOf<AccountTransactionsQuery>();
    });
  });
});
