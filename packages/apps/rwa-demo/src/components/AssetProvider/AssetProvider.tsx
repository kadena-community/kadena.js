'use client';
import {
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { useAccount } from '@/hooks/account';
import { usePaused } from '@/hooks/paused';
import { useSupply } from '@/hooks/supply';
import {
  getAssetMaxSupplyBalance,
  IGetAssetMaxSupplyBalanceResult,
} from '@/services/getAssetMaxSupplyBalance';
import { supply as supplyService } from '@/services/supply';
import { getFullAsset } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { useRouter } from 'next/navigation';

import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IAsset extends IGetAssetMaxSupplyBalanceResult {
  uuid: string;
  name: string;
  supply: number;
}

export interface IAssetContext {
  asset?: IAsset;
  assets: IAsset[];
  paused: boolean;
  setAsset: (asset: IAsset) => void;
  getAsset: (uuid: string) => Promise<IAsset | undefined>;
}

export const AssetContext = createContext<IAssetContext>({
  assets: [],
  paused: false,
  setAsset: () => {},
  getAsset: async () => undefined,
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  const { account } = useAccount();
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [asset, setAsset] = useState<IAsset>();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const storageKey = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY) ?? '';
  const selectedKey =
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY) ?? '';
  const { paused } = usePaused();
  const { data: supply } = useSupply();

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
    setAsset((old) => ({ ...old, ...data }));

    router.replace('/');
    router.refresh();
  };

  const getAsset = async (uuid: string): Promise<IAsset | undefined> => {
    const data = getAssets().find((a) => a.uuid === uuid);
    const extraAssetData = await getAssetMaxSupplyBalance();

    const supplyResult = (await supplyService({
      account: account!,
    })) as number;

    if (!data) return;
    return { ...data, ...extraAssetData, supply: supplyResult ?? 0 };
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

  const loadAssetData = async () => {
    const data = await getAssetMaxSupplyBalance();
    if (!asset) return;
    setAsset({ ...asset, ...data });
  };

  useEffect(() => {
    const asset = getFullAsset();
    setAsset(asset);
    if (asset) {
      return;
    }
  }, []);

  useEffect(() => {
    if (!asset) return;

    setAsset({ ...asset, supply });
  }, [asset?.name, supply]);

  useEffect(() => {
    if (!asset) return;
    loadAssetData();
  }, [asset?.uuid]);

  return (
    <AssetContext.Provider
      value={{ asset, assets, setAsset: handleSelectAsset, getAsset, paused }}
    >
      {children}
    </AssetContext.Provider>
  );
};
