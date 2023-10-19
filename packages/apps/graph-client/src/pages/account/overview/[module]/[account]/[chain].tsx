import { useGetChainAccountQuery } from '@/__generated__/sdk';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import Loader from '@components/loader/loader';
import { mainStyle } from '@components/main/styles.css';
import { Text } from '@components/text';
import routes from '@constants/routes';
import { Box, Grid, Notification, Table } from '@kadena/react-ui';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const ChainAccount: React.FC = () => {
  const router = useRouter();

  const {
    loading: loadingChainAccount,
    data: chainAccountQuery,
    error,
  } = useGetChainAccountQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
      chainId: router.query.chain as string,
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
          {loadingChainAccount && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving account information...</span>
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
          {chainAccountQuery?.chainAccount && (
            <div>
              <Table.Root wordBreak="break-all">
                <Table.Body>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Account Name</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.accountName}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Module</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.moduleName}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Chain</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.chainId}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Balance</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.balance}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Guard Predicate</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.guard.predicate}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td>
                      <strong>Guard Keys</strong>
                    </Table.Td>
                    <Table.Td>
                      {chainAccountQuery.chainAccount.guard.keys}
                    </Table.Td>
                  </Table.Tr>
                </Table.Body>
              </Table.Root>
              <Box margin={'$8'} />
              <Grid.Root columns={2} gap="$lg">
                <Grid.Item>
                  <CompactTransfersTable
                    moduleName={router.query.module as string}
                    accountName={router.query.account as string}
                    chainId={router.query.chain as string}
                    transfers={chainAccountQuery.chainAccount.transfers}
                  />
                </Grid.Item>
                <Grid.Item>
                  <CompactTransactionsTable
                    viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                      router.query.module as string
                    }/${router.query.account as string}?chain=${
                      router.query.chain as string
                    }`}
                    transactions={chainAccountQuery.chainAccount.transactions}
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

export default ChainAccount;
