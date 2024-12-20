import { useTransactions } from '@/hooks/transactions';
import { Stack } from '@kadena/kode-ui';
import type { FC, ReactElement } from 'react';
import { useMemo } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';
import type { ITxType } from '../TransactionsProvider/TransactionsProvider';

interface IProps {
  type: ITxType | ITxType[];
  account?: string;
  fallbackIcon?: ReactElement;
}

export const TransactionTypeSpinner: FC<IProps> = ({
  type,
  account,
  fallbackIcon,
}) => {
  const { getTransactions } = useTransactions();
  const transactions = useMemo(() => {
    const txs = getTransactions(type);
    if (!account) return txs;
    return txs.filter((tx) => tx.accounts.indexOf(account) >= 0);
  }, [type, getTransactions]);

  return transactions.length > 0 ? (
    <Stack title="Someone is updating this value">
      <TransactionPendingIcon />
    </Stack>
  ) : (
    !!fallbackIcon && fallbackIcon
  );
};
