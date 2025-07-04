import type { WALLETTYPES } from '@/constants';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IAgentHookProps } from '@/hooks/getAgentRoles';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import type { User } from 'firebase/auth';
import { createContext } from 'react';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IWalletAccount;
  accounts?: IWalletAccount[];
  error?: IAccountError;
  isMounted: boolean;
  user?: User;
  addAccount: (
    type: keyof typeof WALLETTYPES,
    account?: IWalletAccount,
  ) => Promise<IWalletAccount[] | undefined>;
  removeAccount: (address: string) => void;
  sign: (tx: IUnsignedCommand) => Promise<ICommand | undefined>;
  isAgent: boolean;
  isOwner: boolean;
  isComplianceOwner: boolean;
  isInvestor: boolean;
  isFrozen: boolean;
  selectAccount: (address: string) => void;

  accountRoles: IAgentHookProps;
  isGasPayable: boolean | undefined;
  checkAccountAssetRoles: (asset?: IAsset) => void;
}

export const AccountContext = createContext<IAccountContext | null>(null);
