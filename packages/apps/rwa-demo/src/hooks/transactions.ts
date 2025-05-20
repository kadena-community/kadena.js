import type { ITransactionsContext } from '@/contexts/TransactionsContext/TransactionsContext';
import { TransactionsContext } from '@/contexts/TransactionsContext/TransactionsContext';

import { useContext } from 'react';

export const useTransactions = (): ITransactionsContext =>
  useContext(TransactionsContext);
