import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { LOCALSTORAGE_ASSETS_SELECTED_KEY } from '@/constants';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';

export const getAsset = (): string => {
  const data = localStorage.getItem(
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
  );
  const asset: IAsset | undefined = data
    ? (JSON.parse(data) as IAsset)
    : undefined;

  if (!asset) return '';
  return asset.name;
};
