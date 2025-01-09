import {
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { getAsset, getFullAsset } from '../getAsset';
import { getLocalStorageKey } from '../getLocalStorageKey';

describe('getAsset utils', () => {
  describe('getFullAsset', () => {
    beforeEach(() => {});

    afterEach(() => {
      localStorage.clear();
      vi.resetAllMocks();
    });

    it('should return undefined when no asset is in localstorage', () => {
      const result = getFullAsset();
      expect(result).toEqual(undefined);
    });
    it('should return asset when asset is in LOCALSTORAGE_ASSETS_SELECTED_KEY in localstorage', () => {
      const asset = {
        uuid: 'b5db08d1-8cc2-4ea2-b4bc-52195762e778',
        supply: -1,
        maxSupply: -1,
        maxBalance: -1,
        maxInvestors: -1,
        investorCount: 0,
        contractName: 'he-man',
        namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
      };
      localStorage.setItem(
        getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
        JSON.stringify(asset),
      );

      const result = getFullAsset();
      expect(result).toEqual(asset);
    });
    it('should return the first asset from LOCALSTORAGE_ASSETS_KEY when asset is NOT in LOCALSTORAGE_ASSETS_SELECTED_KEY in localstorage', () => {
      const assets = [
        {
          uuid: 'b5db08d1-8cc2-4ea2-b4bc-52195762e778',
          supply: -1,
          maxSupply: -1,
          maxBalance: -1,
          maxInvestors: -1,
          investorCount: 0,
          contractName: 'he-man',
          namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
        },
        {
          uuid: '',
          supply: -1,
          maxSupply: -1,
          maxBalance: -1,
          maxInvestors: -1,
          investorCount: 0,
          contractName: 'greyskull',
          namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
        },
        {
          uuid: '',
          supply: -1,
          maxSupply: -1,
          maxBalance: -1,
          maxInvestors: -1,
          investorCount: 0,
          contractName: 'skeletor',
          namespace: 'n_baf204eb384dc42edf3c542eeeb6039f41ce5e86',
        },
      ];
      localStorage.setItem(
        getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY),
        JSON.stringify(assets),
      );

      const result = getFullAsset();
      expect(result).toEqual(assets[0]);
    });
  });

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
