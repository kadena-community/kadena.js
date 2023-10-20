import { Box, Notification } from '@kadena/react-ui';

import { useGetTransactionsQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import React from 'react';

const Transactions: React.FC = () => {
  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables: { first: 20 },
  });

  console.log('index', data);

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <main className={mainStyle}>
        <div>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving transactions...</span>
            </div>
          )}
          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <Box marginBottom="$4" />
              <code>{error.message}</code>
              <Box marginBottom="$4" />
              Check if the Graph server is running.
            </Notification.Root>
          )}
          {data?.transactions && (
            <ExtendedTransactionsTable
              transactions={data.transactions}
              fetchMore={fetchMore}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Transactions;
