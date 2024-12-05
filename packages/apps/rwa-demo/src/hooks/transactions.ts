import type { ITransactionsContext } from '@/components/TransactionsProvider/TransactionsProvider';
import { TransactionsContext } from '@/components/TransactionsProvider/TransactionsProvider';

import { useContext } from 'react';

export const useTransactions = (): ITransactionsContext =>
  useContext(TransactionsContext);
