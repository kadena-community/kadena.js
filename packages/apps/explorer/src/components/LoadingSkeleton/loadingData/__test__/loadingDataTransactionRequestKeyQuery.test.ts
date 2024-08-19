import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import { loadingTransactionData } from '../loadingDataTransactionRequestKeyQuery';

describe('loading data', () => {
  describe('loadingDataEventquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingTransactionData).toBeObject();

      expectTypeOf(
        loadingTransactionData,
      ).toMatchTypeOf<TransactionRequestKeyQuery>();
    });
  });
  describe('loadingDataBlockquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(loadingTransactionData).toBeObject();

      expectTypeOf(
        loadingTransactionData,
      ).toMatchTypeOf<TransactionRequestKeyQuery>();
    });
  });
});
