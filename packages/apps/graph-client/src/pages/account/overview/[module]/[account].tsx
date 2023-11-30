import type {
  ModuleAccountTransactionsConnection,
  ModuleAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetAccountQuery } from '@/__generated__/sdk';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { ChainModuleAccountTable } from '@components/chain-module-account-table/chain-module-account-table';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs,
  Notification,
  TabItem,
  Table,
  Tabs,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const Account: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetAccountQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
    },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item>Account Overview</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {data?.account &&
        data?.account?.totalBalance === 0 &&
        data?.account?.chainAccounts.length === 0 && (
          <>
            <Notification color="info" role="status">
              We could not find any data on this account. Please check the
              module and account name.
            </Notification>
            <Box margin={'$4'} />
          </>
        )}
      {data?.account && (
        <div>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.account.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Module</strong>
                </Table.Td>
                <Table.Td>{data.account.moduleName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Balance</strong>
                </Table.Td>
                <Table.Td>{data.account.totalBalance}</Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
          <Box margin={'$8'} />
          <Tabs defaultSelectedKey="Chain Accounts">
            <TabItem title="Chain Accounts" key="Chain Accounts">
              <Box margin={'$4'} />
              <ChainModuleAccountTable
                moduleName={router.query.module as string}
                accountName={router.query.account as string}
                chainAccounts={data.account.chainAccounts}
              />
            </TabItem>

            <TabItem title="Transfers" key="Transfers">
              <Box margin={'$4'} />
              <CompactTransfersTable
                description="All transfers from or to this account"
                moduleName={router.query.module as string}
                accountName={router.query.account as string}
                transfers={
                  data.account.transfers as ModuleAccountTransfersConnection
                }
              />
            </TabItem>
            <TabItem title="Transactions" key="Transactions">
              <Box margin={'$4'} />
              <CompactTransactionsTable
                viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                  router.query.module as string
                }/${router.query.account as string}`}
                transactions={
                  data.account
                    .transactions as ModuleAccountTransactionsConnection
                }
              />
            </TabItem>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default Account;
