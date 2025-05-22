import { LOCALSTORAGE_ASSETS_SELECTED_KEY } from '@/constants';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';

export const getAsset = (): string => {
  const data = localStorage.getItem(
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY),
  );

  if (!data) return '';

  const asset = JSON.parse(data);

  if (!asset) {
    return '';
  }
  return `${asset.namespace}.${asset.contractName}`;
};
