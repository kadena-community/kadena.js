import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type {
  IComplianceProps,
  IComplianceRuleTypes,
} from '@/services/getComplianceRules';
import type { IRecord } from '@/utils/filterRemovedRecords';

import { createContext } from 'react';

export interface IAsset {
  uuid: string;
  contractName: string;
  namespace: string;
  supply: number;
  investorCount: number;
  compliance: IComplianceProps;
  setupComplete?: boolean;
  datajson?: any; // this is for PoC purposes only
}

export interface IAssetContext {
  asset?: IAsset;
  assets: IAsset[];
  paused: boolean;
  setAsset: (asset: IAsset) => void;
  addAsset: ({
    contractName,
    namespace,
    dataType,
  }: {
    contractName: string;
    namespace: string;
    dataType?: 'house' | 'car';
  }) => IAsset | undefined;
  addExistingAsset: (name: string) => IAsset | undefined;
  removeAsset: (asset: IAsset) => void;
  getAsset: (
    uuid: string,
    account: IWalletAccount,
  ) => Promise<IAsset | undefined>;
  maxCompliance: (rule: IComplianceRuleTypes) => number;
  investors: IRecord[];
  investorsIsLoading: boolean;
  agents: IRecord[];
  agentsIsLoading: boolean;
  assetStore: any;
}

export const AssetContext = createContext<IAssetContext | null>(null);
