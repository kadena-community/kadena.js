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
  accounts?: IWalletAccount[];
  error?: IAccountError;
  isMounted: boolean;
  user?: User;
  login: (type: keyof typeof WALLETTYPES) => void;
  logout: () => void;
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
  accounts: undefined,
  isMounted: false,
  login: () => {},
  logout: () => {},
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
