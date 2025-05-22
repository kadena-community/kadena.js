import { LOCALSTORAGE_ASSETS_SELECTED_KEY } from '@/constants';
import { getAsset } from '../getAsset';
import { getLocalStorageKey } from '../getLocalStorageKey';

describe('getAsset utils', () => {
  describe('getAsset', () => {
    beforeEach(() => {});

    afterEach(() => {
      localStorage.clear();
      vi.resetAllMocks();
    });
    it('should return the asset string from the found asset', () => {
      localStorage.setItem(
        getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
        JSON.stringify({
          uuid: 'b5db08d1-8cc2-4ea2-b4bc-52195762e778',
          supply: -1,
          maxSupply: -1,
          maxBalance: -1,
          maxInvestors: -1,
          investorCount: 0,
          contractName: 'he-man',
          namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
        }),
      );

      const result = getAsset();
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
