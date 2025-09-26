import { createContext } from 'react';

export interface IUserData {}

export interface IUserContext {
  signInByGoogle: () => void;
  signInByEmail: (data: { email: string; password: string }) => void;
  signOut: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);
