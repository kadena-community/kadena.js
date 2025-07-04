import type { ITxType } from '@/contexts/TransactionsContext/TransactionsContext';
import { useTransactions } from '@/hooks/transactions';
import { Stack } from '@kadena/kode-ui';
import type { FC, ReactElement } from 'react';
import { useMemo } from 'react';
import { TransactionPendingIcon } from '../TransactionPendingIcon/TransactionPendingIcon';

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
    <Stack
      data-testid="pending-transactionIcon"
      title="Someone is updating this value"
    >
      <TransactionPendingIcon />
    </Stack>
  ) : (
    <Stack data-testid="no-pending-transactionIcon" as="span">
      {!!fallbackIcon && fallbackIcon}
    </Stack>
  );
};
