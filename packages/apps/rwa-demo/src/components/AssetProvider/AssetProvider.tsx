'use client';
import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import {
  INFINITE_COMPLIANCE,
  LOCALSTORAGE_ASSETS_KEY,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { useGetComplianceRules } from '@/hooks/getComplianceRules';
import { useGetInvestorCount } from '@/hooks/getInvestorCount';
import { usePaused } from '@/hooks/paused';
import { useSupply } from '@/hooks/supply';
import type {
  IComplianceProps,
  IComplianceRule,
  IComplianceRuleTypes,
} from '@/services/getComplianceRules';
import { getComplianceRules } from '@/services/getComplianceRules';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { supply as supplyService } from '@/services/supply';
import { getAsset as getAssetUtil, getFullAsset } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import type * as Apollo from '@apollo/client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface IAsset {
  uuid: string;
  contractName: string;
  namespace: string;
  supply: number;
  investorCount: number;
  compliance: IComplianceProps;
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
  maxCompliance: (rule: IComplianceRuleTypes) => number;
}

export const AssetContext = createContext<IAssetContext>({
  assets: [],
  paused: false,
  setAsset: () => {},
  addAsset: () => undefined,
  addExistingAsset: () => undefined,
  removeAsset: (uuid: string) => undefined,
  getAsset: async () => undefined,
  maxCompliance: () => -1,
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
  const { data: complianceRules } = useGetComplianceRules({ asset });
  const { data: complianceSubscriptionData } = useEventSubscriptionSubscription(
    {
      variables: {
        qualifiedName: `${getAssetUtil()}.COMPLIANCE-PARAMETERS`,
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
    return {
      ...data,
      compliance: { ...extraAssetData },
      supply: supplyResult ?? 0,
    };
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
      compliance: {
        maxSupply: {
          isActive: false,
          value: INFINITE_COMPLIANCE,
          key: 'RWA.supply-limit-compliance',
        },
        maxBalance: {
          isActive: false,
          value: INFINITE_COMPLIANCE,
          key: 'RWA.max-balance-compliance',
        },
        maxInvestors: {
          isActive: false,
          value: INFINITE_COMPLIANCE,
          key: 'RWA.max-investors-compliance',
        },
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

  // return the value of the compliance
  const maxCompliance = (ruleKey: IComplianceRuleTypes): number => {
    const returnValue = Object.entries(asset?.compliance ?? {}).find(
      ([key, rule]) => rule.key === ruleKey,
    ) as [number, IComplianceRule] | undefined;

    if (!returnValue?.length) return INFINITE_COMPLIANCE;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, rule] = returnValue;
    if (!asset || !rule || !rule.isActive) return INFINITE_COMPLIANCE;
    return rule.value;
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

      const data = params[0];

      setAsset(
        (old) =>
          old && {
            ...old,
            compliance: {
              ...old.compliance,
              maxSupply: {
                ...old.compliance.maxSupply,
                value: data['supply-limit'],
              },
              maxBalance: {
                ...old.compliance.maxBalance,
                value: data['max-balance-per-investor'],
              },
              maxInvestors: {
                ...old.compliance.maxInvestors,
                value: data['max-investors'].int,
              },
            },
          },
      );
    }
  }, [complianceSubscriptionData]);

  useEffect(() => {
    if (!complianceRules) return;
    setAsset((old) => old && { ...old, compliance: { ...complianceRules } });
  }, [complianceRules]);

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
        maxCompliance,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
