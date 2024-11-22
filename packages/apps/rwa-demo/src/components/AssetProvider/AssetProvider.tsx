'use client';
import { LOCALSTORAGE_ASSETS_KEY } from '@/constants';
import { usePaused } from '@/hooks/paused';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IAsset {
  uuid: string;
  name: string;
}

export interface IAssetContext {
  asset?: IAsset;
  assets: IAsset[];
  paused: boolean;
  setAsset: (asset: IAsset) => void;
}

export const AssetContext = createContext<IAssetContext>({
  assets: [],
  paused: false,
  setAsset: () => {},
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const storageKey = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY) ?? '';
  const { paused } = usePaused();

  const getAssets = () => {
    const result = localStorage.getItem(storageKey);
    setAssets(JSON.parse(result ?? '[]'));
  };

  const storageListener = (event: StorageEvent | Event) => {
    if (event.type !== storageKey && 'key' in event && event.key !== storageKey)
      return;
    getAssets();
  };

  const handleSelectAsset = (data: IAsset) => {
    setAsset(data);
  };

  useEffect(() => {
    getAssets();
    window.addEventListener(storageKey, storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(storageKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  return (
    <AssetContext.Provider
      value={{ asset, assets, setAsset: handleSelectAsset, paused }}
    >
      {children}
    </AssetContext.Provider>
  );
};
