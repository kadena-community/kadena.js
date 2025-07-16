import { useTransactions } from '@/hooks/transactions';
import { Notification, Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import { ActiveTransaction } from './ActiveTransaction';
import { activeListClass } from './style.css';

export const ActiveTransactionsList: FC = () => {
  const { transactions, removeTransaction } = useTransactions();

  return (
    <Stack
      as="ul"
      width="100%"
      flexDirection="column"
      gap="md"
      className={activeListClass}
    >
      {transactions.length === 0 ? (
        <Notification role="status" type="inlineStacked">
          No active transactions, for this asset, at the moment.
        </Notification>
      ) : (
        <>
          {transactions.map((transaction) => (
            <ActiveTransaction
              key={transaction.requestKey}
              transaction={transaction}
              onDismiss={removeTransaction}
            />
          ))}
        </>
      )}
    </Stack>
  );
};
