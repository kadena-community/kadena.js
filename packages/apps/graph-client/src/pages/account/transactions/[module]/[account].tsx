import { useGetTransactionsQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import routes from '@/constants/routes';
import { Box, Breadcrumbs, Notification } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const AccountTransactions: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
      ...(router.query.chain && { chainId: router.query.chain as string }),
      first: 10,
    },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          href={`${routes.ACCOUNT}/${router.query.module as string}/${
            router.query.account as string
          }`}
        >
          Account Overview
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Chain</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

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

export default AccountTransactions;
