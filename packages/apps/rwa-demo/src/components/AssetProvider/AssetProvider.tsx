'use client';
import type { Exact, Scalars } from '@/__generated__/sdk';
import { useEventSubscriptionSubscription } from '@/__generated__/sdk';
import {
  INFINITE_COMPLIANCE,
  LOCALSTORAGE_ASSETS_SELECTED_KEY,
} from '@/constants';
import { useAccount } from '@/hooks/account';
import { useGetComplianceRules } from '@/hooks/getComplianceRules';
import { useGetInvestorCount } from '@/hooks/getInvestorCount';
import { useOrganisation } from '@/hooks/organisation';
import { usePaused } from '@/hooks/paused';
import { useSupply } from '@/hooks/supply';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type {
  IComplianceProps,
  IComplianceRule,
  IComplianceRuleTypes,
} from '@/services/getComplianceRules';
import { getComplianceRules } from '@/services/getComplianceRules';
import { coreEvents } from '@/services/graph/eventSubscription.graph';
import { supply as supplyService } from '@/services/supply';
import { getAsset as getAssetUtil } from '@/utils/getAsset';
import { getLocalStorageKey } from '@/utils/getLocalStorageKey';
import { AssetStore } from '@/utils/store/assetStore';
import type * as Apollo from '@apollo/client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useMemo, useState } from 'react';

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
  removeAsset: (asset: IAsset) => void;
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
  removeAsset: (asset: IAsset) => undefined,
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
  const { account, checkAccountAssetRoles } = useAccount();
  const { organisation } = useOrganisation();
  const [assets, setAssets] = useState<IAsset[]>([]);
  const selectedKey =
    getLocalStorageKey(LOCALSTORAGE_ASSETS_SELECTED_KEY) ?? '';
  const { paused } = usePaused(asset);
  const { data: supply } = useSupply(asset);
  const { data: investorCount } = useGetInvestorCount(asset);
  const { data: complianceRules } = useGetComplianceRules({ asset });
  const { data: complianceSubscriptionData } = useEventSubscriptionSubscription(
    {
      variables: {
        qualifiedName: `${getAssetUtil(asset)}.COMPLIANCE-PARAMETERS`,
      },
    },
  );

  const assetStore = useMemo(() => {
    if (!organisation) return;
    return AssetStore(organisation);
  }, [organisation]);

  useEffect(() => {
    if (!organisation?.id) return;

    const unlistenAssets = assetStore?.listenToAssets(setAssets);
    const result = localStorage.getItem(selectedKey);
    if (!result) return;
    const asset = JSON.parse(result);
    const unlistenAsset = assetStore?.listenToAsset(asset, setAsset);

    return () => {
      console.log('unlisten assets');
      if (unlistenAssets) {
        unlistenAssets();
      }
      if (unlistenAsset) {
        unlistenAsset();
      }
    };
  }, [organisation, assetStore]);

  const getAsset = async (
    uuid: string,
    account: IWalletAccount,
  ): Promise<IAsset | undefined> => {
    const data = assets.find((a) => a.uuid === uuid);
    if (!data) return;
    const extraAssetData = await getComplianceRules(data);

    const supplyResult = (await supplyService(
      {
        account: account!,
      },
      data,
    )) as number;

    const foundAsset = {
      ...data,
      compliance: { ...extraAssetData },
      supply: supplyResult ?? 0,
    };

    await assetStore?.updateAsset(foundAsset);

    return foundAsset;
  };

  useEffect(() => {
    const storageListener = async (event: StorageEvent | Event) => {
      if (
        event.type !== selectedKey &&
        'key' in event &&
        event.key !== selectedKey
      )
        return;

      const result = localStorage.getItem(selectedKey);
      if (!result || !account || !organisation) return;

      const storageAsset = JSON.parse(result);
      const foundAsset = await getAsset(storageAsset.uuid, account);
      if (!foundAsset) return;
      await assetStore?.updateAsset(foundAsset);

      window.location.href = '/';
    };

    window.addEventListener(selectedKey, storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(selectedKey, storageListener);
      window.removeEventListener('storage', storageListener);
    };
  }, [organisation, account, assetStore]);

  const handleSelectAsset = (data: IAsset) => {
    localStorage.setItem(selectedKey, JSON.stringify(data));
    window.dispatchEvent(new Event(selectedKey));
  };

  const removeAsset = async (asset: IAsset) => {
    await assetStore?.removeAsset(asset);
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
          key: 'supply-limit-compliance-v1',
        },
        maxBalance: {
          isActive: false,
          value: INFINITE_COMPLIANCE,
          key: 'max-balance-compliance-v1',
        },
        maxInvestors: {
          isActive: false,
          value: INFINITE_COMPLIANCE,
          key: 'max-investors-compliance-v1',
        },
      },
      investorCount: 0,
      contractName,
      namespace,
    };

    if (
      !assets.find(
        (a) =>
          a.namespace === asset.namespace &&
          a.contractName === asset.contractName,
      )
    ) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      assetStore?.addAsset(asset);
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
    if (!asset?.compliance) return INFINITE_COMPLIANCE;
    const returnValue = Object.entries(asset?.compliance).find(
      ([key, rule]) => rule.key === ruleKey,
    ) as [number, IComplianceRule] | undefined;

    if (!returnValue?.length) return INFINITE_COMPLIANCE;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, rule] = returnValue;
    if (!asset || !rule || !rule.isActive) return INFINITE_COMPLIANCE;
    return rule.value;
  };

  useEffect(() => {
    if (!asset || !organisation) return;
    const data = { ...asset, investorCount } as IAsset;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    assetStore?.updateAsset(data);
  }, [investorCount, assetStore]);

  useEffect(() => {
    if (!asset || !organisation) return;

    const data = { ...asset, supply } as IAsset;

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    assetStore?.updateAsset(data);
  }, [asset?.contractName, supply, assetStore]);

  // when the account or the asset changes, we need to check the roles of the account
  useEffect(() => {
    if (!account || !asset) return;
    checkAccountAssetRoles(asset);
  }, [asset?.contractName, account?.address, checkAccountAssetRoles]);

  useEffect(() => {
    if (
      complianceSubscriptionData?.events?.length &&
      complianceSubscriptionData.events[0].parameters
    ) {
      const params = JSON.parse(
        complianceSubscriptionData.events[0].parameters,
      );

      const data = params[0];

      if (!asset || !organisation) return;

      const newData = {
        ...asset,
        compliance: {
          ...asset.compliance,
          maxSupply: {
            ...asset.compliance.maxSupply,
            value: data['supply-limit'],
          },
          maxBalance: {
            ...asset.compliance.maxBalance,
            value: data['max-balance-per-investor'],
          },
          maxInvestors: {
            ...asset.compliance.maxInvestors,
            value: data['max-investors'].int,
          },
        },
      } as IAsset;
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      assetStore?.updateAsset(newData);
    }
  }, [complianceSubscriptionData, assetStore]);

  useEffect(() => {
    if (!complianceRules) return;
    if (!asset || !organisation) return;

    const data = { ...asset, compliance: { ...complianceRules } } as IAsset;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    assetStore?.updateAsset(data);
  }, [complianceRules, assetStore]);

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
