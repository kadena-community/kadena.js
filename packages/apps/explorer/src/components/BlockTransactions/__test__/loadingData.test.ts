import type { BlockTransactionsQuery } from '@/__generated__/sdk';
import { loadingData } from '../loadingDataBlocktransactionsquery';

describe('loading data', () => {
  describe('loadingDataAccountTransactionsquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingData).toBeObject();

      expectTypeOf(loadingData).toMatchTypeOf<BlockTransactionsQuery>();
    });
  });
});
