import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import {
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';

export const getFullAsset = (): IAsset | undefined => {
  const data = localStorage.getItem(
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
  );
  let asset: IAsset | undefined = data
    ? (JSON.parse(data) as IAsset)
    : undefined;

  if (!asset) {
    const data = localStorage.getItem(
      getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY),
    );
    if (!data) return;
    const assets = JSON.parse(data);
    asset = assets[0];
  }
  return asset;
};

export const getAsset = (): string => {
  const asset = getFullAsset();
  if (!asset) {
    throw new Error('no asset found');
  }
  return `${asset.namespace}.${asset.contractName}`;
};
