import type { User } from 'firebase/auth';
import { createContext } from 'react';

export interface IUserContext {
  user?: User;
  signIn: () => void;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  signIn: () => {},
});
