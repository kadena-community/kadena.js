import type { BlocksFromHeightQuery } from '@/__generated__/sdk';
import { blockHeightLoading } from '../loadingBlockHeightData';

describe('loading data', () => {
  describe('loadingDataEventquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(blockHeightLoading).toBeObject();

      expectTypeOf(blockHeightLoading).toMatchTypeOf<BlocksFromHeightQuery>();
    });
  });
  describe('loadingDataBlockquery', () => {
    it('should return the correct type', () => {
      expectTypeOf(blockHeightLoading).toBeObject();

      expectTypeOf(blockHeightLoading).toMatchTypeOf<BlocksFromHeightQuery>();
    });
  });
});
