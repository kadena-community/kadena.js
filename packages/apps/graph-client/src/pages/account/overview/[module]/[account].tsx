import { Box, Grid, Notification, Table } from '@kadena/react-ui';

import { useGetAccountQuery } from '../../../../__generated__/sdk';
import { ChainModuleAccountTable } from '../../../../components/chain-module-account-table/chain-module-account-table';
import { CompactTransactionsTable } from '../../../../components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '../../../../components/compact-transfers-table/compact-transfers-table';
import Loader from '../../../../components/loader/loader';
import { mainStyle } from '../../../../components/main/styles.css';
import { Text } from '../../../../components/text';

import Head from 'next/head';
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
          {loadingAccount && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving account information...</span>
            </div>
          )}
          {error && (
            <Notification.Root color="negative" icon="Close">
              Unknown error:
              <br />
              <br />
              <code>{error.message}</code>
              <br />
              <br />
              Check if the Graph server is running.
            </Notification.Root>
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
                    moduleName={router.query.module as string}
                    accountName={router.query.account as string}
                    transfers={accountQuery.account.transfers}
                  />
                </Grid.Item>
                <Grid.Item>
                  <CompactTransactionsTable
                    moduleName={router.query.module as string}
                    accountName={router.query.account as string}
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
