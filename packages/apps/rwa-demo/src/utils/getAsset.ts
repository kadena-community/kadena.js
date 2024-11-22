import { LOCALSTORAGE_ASSETS_SELECTED_KEY } from '@/constants';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import type { IAsset } from './AssetProvider';

export const getAsset = (): IAsset => {
  const data = localStorage.getItem(
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
  );
  const json = data && JSON.parse(data);

  return json;
};
