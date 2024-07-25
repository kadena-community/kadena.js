import type { IChainBlock } from '@/services/block';
import { blockDataLoading } from '../loadingData';

describe('loading data', () => {
  describe('loadingDataAccountTransactionsquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(blockDataLoading).toBeObject();

      expectTypeOf(blockDataLoading).toMatchTypeOf<IChainBlock>();
    });
  });
});
