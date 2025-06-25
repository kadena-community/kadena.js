import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IdTokenResult, User } from 'firebase/auth';
import { createContext } from 'react';

export interface IUserData {
  accounts: IWalletAccount[];
  uid: string;
  data?: {
    displayName?: string;
  };
  aliases?: Record<string, { alias: string }>;
}

export interface IUserContext {
  user?: User;
  userToken?: IdTokenResult;
  userData?: IUserData;
  isMounted: boolean; //set to true if all user data is loaded (user, userToken)
  signInByGoogle: () => void;
  signInByEmail: (data: { email: string; password: string }) => void;
  signOut: () => void;
  addAccount: (account: IWalletAccount) => void;
  removeAccount: (address: string) => void;
  userStore?: any;
  findAliasByAddress: (address?: string) => string;
}

export const UserContext = createContext<IUserContext | null>(null);
