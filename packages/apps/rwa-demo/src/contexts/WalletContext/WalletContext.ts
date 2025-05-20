import type { WALLETTYPES } from '@/constants';
import type { IAgentHookProps } from '@/hooks/getAgentRoles';
import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import type { User } from 'firebase/auth';
import { createContext } from 'react';

interface IAccountError {
  message: string;
}

export interface IWalletContext {
  account?: IWalletAccount;
  wallets?: IWalletAccount[];
  error?: IAccountError;
  isMounted: boolean;
  user?: User;
  addWallet: (
    type: keyof typeof WALLETTYPES,
    account?: IWalletAccount,
  ) => Promise<IWalletAccount[] | undefined>;
  removeWallet: (walletAddress: string) => void;
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

export const WalletContext = createContext<IWalletContext>({
  account: undefined,
  wallets: [],
  isMounted: false,
  addWallet: async (
    type: keyof typeof WALLETTYPES,
    account?: IWalletAccount | undefined,
  ) => {
    return undefined;
  },
  removeWallet: async () => {},
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
