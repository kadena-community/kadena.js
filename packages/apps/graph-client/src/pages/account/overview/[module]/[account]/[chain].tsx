import type {
  ChainModuleAccountTransactionsConnection,
  ChainModuleAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetChainAccountQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ErrorBox } from '@/components/error-box/error-box';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Grid, Table } from '@kadena/react-ui';
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
      moduleName: router.query.moduleName as string,
      accountName: router.query.account as string,
      chainId: router.query.chain as string,
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
          {loadingChainAccount && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving account information...</span>
            </div>
          )}
          {error && <ErrorBox error={error} />}
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
                    transfers={
                      chainAccountQuery.chainAccount
                        .transfers as ChainModuleAccountTransfersConnection
                    }
                  />
                </Grid.Item>
                <Grid.Item>
                  <CompactTransactionsTable
                    viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                      router.query.module as string
                    }/${router.query.account as string}?chain=${
                      router.query.chain as string
                    }`}
                    transactions={
                      chainAccountQuery.chainAccount
                        .transactions as ChainModuleAccountTransactionsConnection
                    }
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
module;
