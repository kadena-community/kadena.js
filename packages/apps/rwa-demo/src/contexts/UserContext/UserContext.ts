import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface IUserData {
  wallets: string[];
  uid: string;
}
export interface IUserContext {
  user?: User;
  userData?: IUserData;
  signIn: () => void;
  addWallet: (walletAddress: string) => void;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  userData: undefined,
  signIn: () => {},
  addWallet: (addWallet: string) => {},
});
