import type { AccountTransfersQuery } from '@/__generated__/sdk';
import { loadingData } from '../loadingDataAccountTransfersquery';

describe('loading data', () => {
  describe('loadingDataAccountTransactionsquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingData).toBeObject();

      expectTypeOf(loadingData).toMatchTypeOf<AccountTransfersQuery>();
    });
  });
});
