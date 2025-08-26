import type { ITransactionsContext } from '@/contexts/TransactionsContext/TransactionsContext';
import { TransactionsContext } from '@/contexts/TransactionsContext/TransactionsContext';
import { useContext } from 'react';

export const useTransactions = (): ITransactionsContext => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error(
      'useTransactions must be used within a TransactionsContextProvider',
    );
  }
  return context;
};
