import type { IAccountContext } from '@/contexts/AccountContext/AccountContext';
import { AccountContext } from '@/contexts/AccountContext/AccountContext';
import { useContext } from 'react';

export const useAccount = (): IAccountContext => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccount must be used within a AccountContextProvider');
  }
  return context;
};
