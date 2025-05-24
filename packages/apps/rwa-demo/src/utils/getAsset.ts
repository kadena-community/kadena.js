import type { IAsset } from '@/components/AssetProvider/AssetProvider';

export const getAsset = (asset?: IAsset): string => {
  // const data = localStorage.getItem(
  //   getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
  // );

  // if (!data) return '';

  // const asset = JSON.parse(data);

  if (!asset) {
    return '';
  }
  return `${asset.namespace}.${asset.contractName}`;
};
