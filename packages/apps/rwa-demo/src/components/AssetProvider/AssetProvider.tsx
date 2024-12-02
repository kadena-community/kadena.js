'use client';
import {
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { usePaused } from '@/hooks/paused';
import { getFullAsset } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { useRouter } from 'next/navigation';

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
  getAsset: (uuid: string) => IAsset | undefined;
  removeAsset: (uuid: string) => void;
}

export const AssetContext = createContext<IAssetContext>({
  assets: [],
  paused: false,
  setAsset: () => {},
  getAsset: (uuid: string) => undefined,
  removeAsset: (uuid: string) => undefined,
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const storageKey = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY) ?? '';
  const selectedKey =
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY) ?? '';
  const { paused } = usePaused();

  const getAssets = (): IAsset[] => {
    const result = localStorage.getItem(storageKey);
    const arr = JSON.parse(result ?? '[]');
    setAssets(arr);
    return arr ?? [];
  };

  const storageListener = (event: StorageEvent | Event) => {
    if (event.type !== storageKey && 'key' in event && event.key !== storageKey)
      return;

    getAssets();
  };

  const handleSelectAsset = (data: IAsset) => {
    localStorage.setItem(selectedKey, JSON.stringify(data));
    window.dispatchEvent(new Event(selectedKey));
    setAsset(data);

    router.replace('/');
    router.refresh();
  };

  const getAsset = (uuid: string) => {
    const data = getAssets().find((a) => a.uuid === uuid);
    return data;
  };
  const removeAsset = (uuid: string) => {
    const data = getAssets().filter((a) => a.uuid !== uuid);
    localStorage.setItem(storageKey, JSON.stringify(data));
    window.dispatchEvent(new Event(storageKey));
    setAssets(data);
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

  useEffect(() => {
    const asset = getFullAsset();
    setAsset(asset);
    if (asset) {
      return;
    }
  }, []);

  return (
    <AssetContext.Provider
      value={{
        asset,
        assets,
        setAsset: handleSelectAsset,
        getAsset,
        removeAsset,
        paused,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
