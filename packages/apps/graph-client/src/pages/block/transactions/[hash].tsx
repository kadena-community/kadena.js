import { Box, Button, Link, Notification, Table } from '@kadena/react-ui';

import { useGetTransactionsQuery } from '@/__generated__/sdk';
import Loader from '@components/loader/loader';
import { mainStyle } from '@components/main/styles.css';
import { Text } from '@components/text';
import routes from '@constants/routes';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';

const BlockTransactions: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables: { blockHash: router.query.hash as string, first: 10 },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Head>
        <title>Kadena Graph Client</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={mainStyle}>
        <Text
          as="h1"
          css={{ display: 'block', color: '$mauve12', fontSize: 48, my: '$12' }}
        >
          Kadena Graph Client
        </Text>
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

export default BlockTransactions;
