import { useTransactions } from '@/hooks/transactions';
import { env } from '@/utils/env';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';

export const ActiveTransactionsList: FC = () => {
  const { transactions } = useTransactions();

  return (
    <Stack as="ul" width="100%" flexDirection="column">
      {transactions.map((transaction) => (
        <li key={transaction.requestKey}>
          <a
            href={`https://explorer.kadena.io/${env.NETWORKID}/transaction/${transaction.requestKey}`}
            target="_blank"
            rel="noreferrer"
          >
            {transaction.requestKey}
          </a>
        </li>
      ))}
    </Stack>
  );
};
