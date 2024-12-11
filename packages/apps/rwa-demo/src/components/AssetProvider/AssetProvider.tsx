'use client';
import {
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { usePaused } from '@/hooks/paused';
import { useSupply } from '@/hooks/supply';
import type { IGetAssetMaxSupplyBalanceResult } from '@/services/getAssetMaxSupplyBalance';
import { getAssetMaxSupplyBalance } from '@/services/getAssetMaxSupplyBalance';
import { supply as supplyService } from '@/services/supply';
import { getFullAsset } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';

import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IAsset extends IGetAssetMaxSupplyBalanceResult {
  uuid: string;
  contractName: string;
  namespace: string;
  supply: number;
}

export interface IAssetContext {
  asset?: IAsset;
  assets: IAsset[];
  paused: boolean;
  setAsset: (asset: IAsset) => void;
  addAsset: ({
    contractName,
    namespace,
  }: {
    contractName: string;
    namespace: string;
  }) => IAsset | undefined;
  addExistingAsset: (name: string) => IAsset | undefined;
  removeAsset: (uuid: string) => void;
  getAsset: (
    uuid: string,
    account: IWalletAccount,
  ) => Promise<IAsset | undefined>;
}

export const AssetContext = createContext<IAssetContext>({
  assets: [],
  paused: false,
  setAsset: () => {},
  addAsset: () => undefined,
  addExistingAsset: () => undefined,
  removeAsset: (uuid: string) => undefined,
  getAsset: async () => undefined,
});

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
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
    window.dispatchEvent(new Event(selectedKey));

    window.location.href = '/';
  };

  const getAsset = async (
    uuid: string,
    account: IWalletAccount,
  ): Promise<IAsset | undefined> => {
    const data = getAssets().find((a) => a.uuid === uuid);
    const extraAssetData = await getAssetMaxSupplyBalance();

    const supplyResult = (await supplyService({
      account: account!,
    })) as number;

    if (!data) return;
    return { ...data, ...extraAssetData, supply: supplyResult ?? 0 };
  };
  const removeAsset = (uuid: string) => {
    const data = getAssets().filter((a) => a.uuid !== uuid);
    localStorage.setItem(storageKey, JSON.stringify(data));
    window.dispatchEvent(new Event(storageKey));
    setAssets(data);
  };

  const addAsset = ({
    contractName,
    namespace = 'RWA',
  }: {
    contractName: string;
    namespace: string;
  }) => {
    const asset: IAsset = {
      uuid: crypto.randomUUID(),
      supply: -1,
      maxSupply: -1,
      maxBalance: -1,
      contractName,
      namespace,
    };

    //check if the asset is already there?
    const allAssets = getAssets();
    if (
      !allAssets.find(
        (a) =>
          a.namespace === asset.namespace &&
          a.contractName === asset.contractName,
      )
    ) {
      const data = [...allAssets, asset];
      localStorage.setItem(storageKey, JSON.stringify(data));
      window.dispatchEvent(new Event(storageKey));
      setAssets(data);
    }

    return asset;
  };

  const addExistingAsset = (name: string) => {
    const nameArray = name.split('.');
    if (nameArray.length !== 2) {
      throw new Error('asset contract not valid format');
    }

    return addAsset({ namespace: nameArray[0], contractName: nameArray[1] });
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

    setAsset((old) => old && { ...old, ...data });
  };

  useEffect(() => {
    if (asset) return;
    const innerAsset = getFullAsset();
    setAsset(innerAsset);
  }, [asset?.namespace, asset?.contractName]);

  useEffect(() => {
    if (!asset) return;

    setAsset((old) => old && { ...old, supply });
  }, [asset?.contractName, supply]);

  useEffect(() => {
    if (!asset) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadAssetData();
  }, [asset?.uuid]);

  return (
    <AssetContext.Provider
      value={{
        asset,
        assets,
        setAsset: handleSelectAsset,
        addAsset,
        addExistingAsset,
        getAsset,
        removeAsset,
        paused,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
