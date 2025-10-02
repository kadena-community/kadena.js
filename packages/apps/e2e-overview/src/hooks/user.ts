import type { IUserContext } from '@/context/UserContext/UserContext';
import { UserContext } from '@/context/UserContext/UserContext';
import { useContext } from 'react';

export const useUser = (): IUserContext => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
