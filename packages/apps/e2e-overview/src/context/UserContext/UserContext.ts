import type { Database } from '@/database.types';
import type { User } from '@supabase/supabase-js';
import { createContext } from 'react';

export interface IUserContext {
  user?: User;
  userData?: Database['public']['Tables']['profiles']['Row'];
  isMounted: boolean;
  signInByGoogle: () => void;
  signInByEmail: (data: { email: string; password: string }) => void;
  signOut: () => void;
}

export const UserContext = createContext<IUserContext | null>(null);
