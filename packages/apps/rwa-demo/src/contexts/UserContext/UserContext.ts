import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface IUserData {
  accounts: IWalletAccount[];
  uid: string;
}
export interface IUserContext {
  user?: User;
  userData?: IUserData;
  signIn: () => void;
  signOut: () => void;
  addAccount: (account: IWalletAccount) => void;
  removeAccount: (address: string) => void;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  userData: undefined,
  signIn: () => {},
  signOut: () => {},
  addAccount: (account: IWalletAccount) => {},
  removeAccount: (address: string) => {},
});
