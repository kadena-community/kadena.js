import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

export interface IUserContext {
  user?: User;
  isMounted: boolean;
  signInByGoogle: () => void;
  signInByEmail: (data: { email: string; password: string }) => void;
  signOut: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);
