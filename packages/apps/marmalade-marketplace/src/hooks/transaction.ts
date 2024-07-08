import type { ITransactionContext } from '@/providers/TransactionProvider/TransactionProvider';
import { TransactionContext } from '@/providers/TransactionProvider/TransactionProvider';

import { useContext } from 'react';

export const useTransaction = (): ITransactionContext => useContext(TransactionContext);
