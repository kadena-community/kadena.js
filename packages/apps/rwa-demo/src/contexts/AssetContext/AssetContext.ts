import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type {
  IComplianceProps,
  IComplianceRuleTypes,
} from '@/services/getComplianceRules';

import { createContext } from 'react';

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

export const AssetContext = createContext<IAssetContext | null>(null);
