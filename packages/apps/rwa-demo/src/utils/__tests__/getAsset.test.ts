import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { getAsset } from '../getAsset';

describe('getAsset utils', () => {
  describe('getAsset', () => {
    beforeEach(() => {});

    afterEach(() => {
      localStorage.clear();
      vi.resetAllMocks();
    });
    it('should return the asset string from the found asset', () => {
      const asset = {
        uuid: 'b5db08d1-8cc2-4ea2-b4bc-52195762e778',
        supply: -1,
        maxSupply: -1,
        maxBalance: -1,
        maxInvestors: -1,
        investorCount: 0,
        contractName: 'he-man',
        namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
      } as unknown as IAsset;

      const result = getAsset(asset);
      expect(result).toEqual(
        'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86.he-man',
      );
    });
    it('should return empty string when there is no asset in localstorage', () => {
      const result = getAsset();
      expect(result).toEqual('');
    });
  });
});
