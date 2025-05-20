import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface IUserData {
  wallets: IWalletAccount[];
  uid: string;
}
export interface IUserContext {
  user?: User;
  userData?: IUserData;
  signIn: () => void;
  addWallet: (wallet: IWalletAccount) => void;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  userData: undefined,
  signIn: () => {},
  addWallet: (wallet: IWalletAccount) => {},
});
