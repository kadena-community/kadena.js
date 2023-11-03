import { useGetAccountQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ErrorBox } from '@/components/error-box/error-box';
import { ChainModuleAccountTable } from '@components/chain-module-account-table/chain-module-account-table';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Grid, Notification, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const Account: React.FC = () => {
  const router = useRouter();

  const {
    loading: loadingAccount,
    data: accountQuery,
    error,
  } = useGetAccountQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
    },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Account Overview</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <main className={mainStyle}>
        <div>
          {loadingAccount && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving account information...</span>
            </div>
          )}
          {error && <ErrorBox error={error} />}
          {accountQuery?.account &&
            accountQuery?.account?.totalBalance === 0 &&
            accountQuery?.account?.chainAccounts.length === 0 && (
              <>
                <Notification.Root color="info">
                  We could not find any data on this account. Please check the
                  module and account name.
                </Notification.Root>
                <Box margin={'$4'} />
              </>
            )}
          {accountQuery?.account && (
            <div>
              <Table.Root wordBreak="break-all">
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Account Name</strong>
                    </Table.Td>
                    <Table.Td>{accountQuery.account.accountName}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Module</strong>
                    </Table.Td>
                    <Table.Td>{accountQuery.account.moduleName}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Balance</strong>
                    </Table.Td>
                    <Table.Td>{accountQuery.account.totalBalance}</Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <Box margin={'$4'} />
              <ChainModuleAccountTable
                moduleName={router.query.module as string}
                accountName={router.query.account as string}
                chainAccounts={accountQuery.account.chainAccounts}
              />
              <Box margin={'$8'} />
              <Grid.Root columns={2} gap="$lg">
                <Grid.Item>
                  <CompactTransfersTable
                    description="All transfers from or to this account"
                    moduleName={router.query.module as string}
                    accountName={router.query.account as string}
                    transfers={accountQuery.account.transfers}
                  />
                </Grid.Item>
                <Grid.Item>
                  <CompactTransactionsTable
                    viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                      router.query.module as string
                    }/${router.query.account as string}`}
                    transactions={accountQuery.account.transactions}
                  />
                </Grid.Item>
              </Grid.Root>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Account;
