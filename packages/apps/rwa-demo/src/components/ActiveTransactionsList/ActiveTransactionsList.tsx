import { useTransactions } from '@/hooks/transactions';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { ActiveTransaction } from './ActiveTransaction';
import { activeListClass } from './style.css';

export const ActiveTransactionsList: FC = () => {
  const { transactions } = useTransactions();

  return (
    <Stack
      as="ul"
      width="100%"
      flexDirection="column"
      gap="md"
      className={activeListClass}
    >
      {transactions.map((transaction) => (
        <ActiveTransaction
          key={transaction.requestKey}
          transaction={transaction}
        />
      ))}
    </Stack>
  );
};
