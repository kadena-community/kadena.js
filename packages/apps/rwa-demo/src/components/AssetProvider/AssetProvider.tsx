'use client';
import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import {
  INFINITE_COMPLIANCE,
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { useGetInvestorCount } from '@/hooks/getInvestorCount';
import { usePaused } from '@/hooks/paused';
import { useSupply } from '@/hooks/supply';
import type { IComplianceProps } from '@/services/getComplianceRules';
import { getComplianceRules } from '@/services/getComplianceRules';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { supply as supplyService } from '@/services/supply';
import { getAsset as getAssetUtil, getFullAsset } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import type * as Apollo from '@apollo/client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IAsset extends IComplianceProps {
  uuid: string;
  contractName: string;
  namespace: string;
  supply: number;
  investorCount: number;
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

export type EventQueryVariables = Exact<{
  qualifiedName: Scalars['String']['input'];
}>;

export const getEventsDocument = (
  variables: EventQueryVariables = {
    qualifiedName: '',
  },
): Apollo.DocumentNode => coreEvents;

export const AssetProvider: FC<PropsWithChildren> = ({ children }) => {
  const [asset, setAsset] = useState<IAsset>();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const storageKey = getLocalStorageKey(LOCALSTORAGE_ASSETS_KEY) ?? '';
  const selectedKey =
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY) ?? '';
  const { paused } = usePaused();
  const { data: supply } = useSupply();
  const { data: investorCount } = useGetInvestorCount();
  const { data: complianceSubscriptionData } = useEventSubscriptionSubscription(
    {
      variables: {
        qualifiedName: `${getAssetUtil()}.SET-COMPLIANCE-PARAMETERS`,
      },
    },
  );

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
    const extraAssetData = await getComplianceRules();

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
      supply: INFINITE_COMPLIANCE,
      maxSupply: {
        isActive: false,
        value: INFINITE_COMPLIANCE,
      },
      maxBalance: {
        isActive: false,
        value: INFINITE_COMPLIANCE,
      },
      maxInvestors: {
        isActive: false,
        value: INFINITE_COMPLIANCE,
      },
      investorCount: 0,
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
    const data = await getComplianceRules();

    setAsset((old) => old && { ...old, ...data });
  };

  useEffect(() => {
    setAsset((old) => old && { ...old, investorCount });
  }, [investorCount]);

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
    if (
      complianceSubscriptionData?.events?.length &&
      complianceSubscriptionData.events[0].parameters
    ) {
      const params = JSON.parse(
        complianceSubscriptionData.events[0].parameters,
      );

      console.log(complianceSubscriptionData);
      const data = params[0];

      setAsset(
        (old) =>
          old && {
            ...old,
            maxSupply: {
              ...old.maxSupply,
              value: data['supply-limit'],
            },
            maxBalance: {
              ...old.maxBalance,
              value: data['max-balance-per-investor'],
            },
            maxInvestors: {
              ...old.maxInvestors,
              value: data['max-investors'].int,
            },
          },
      );
    }
  }, [complianceSubscriptionData]);

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
