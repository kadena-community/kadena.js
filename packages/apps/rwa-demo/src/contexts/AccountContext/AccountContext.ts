import type { WALLETTYPES } from '@/constants';
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
  selectAccount: (account: IWalletAccount) => void;
  balance: number;
  accountRoles: IAgentHookProps;
  isGasPayable: boolean | undefined;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,
  accounts: [],
  isMounted: false,
  addAccount: async (
    type: keyof typeof WALLETTYPES,
    account?: IWalletAccount | undefined,
  ) => {
    return undefined;
  },
  removeAccount: async () => {},
  sign: async () => undefined,
  isAgent: false,
  isOwner: false,
  isComplianceOwner: false,
  isInvestor: false,
  isFrozen: false,
  selectAccount: () => {},
  balance: 0,
  accountRoles: {
    isMounted: false,
    getAll: () => [],
    isAgentAdmin: () => {
      return false;
    },
    isFreezer: () => false,
    isTransferManager: () => false,
  },
  isGasPayable: undefined,
});
