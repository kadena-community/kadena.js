import type {
  ChainFungibleAccount,
  FungibleAccountTransactionsConnection,
  FungibleAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetFungibleAccountQuery } from '@/__generated__/sdk';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { ChainFungibleAccountTable } from '@components/chain-module-account-table/chain-module-account-table';
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

  const { loading, data, error } = useGetFungibleAccountQuery({
    variables: {
      fungibleName: router.query.fungible as string,
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

      {data?.fungibleAccount &&
        data?.fungibleAccount?.totalBalance === 0 &&
        data?.fungibleAccount?.chainAccounts.length === 0 && (
          <>
            <Notification intent="info" role="status">
              We could not find any data on this account. Please check the
              fungible name and account name.
            </Notification>
            <Box margin={'$4'} />
          </>
        )}
      {data?.fungibleAccount && (
        <div>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.fungibleAccount.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Fungible</strong>
                </Table.Td>
                <Table.Td>{data.fungibleAccount.fungibleName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Balance</strong>
                </Table.Td>
                <Table.Td>{data.fungibleAccount.totalBalance}</Table.Td>
              </Table.Tr>
            </Table.Body>
          </Table.Root>
          <Box margin={'$8'} />
          <Tabs defaultSelectedKey="Chain Accounts">
            <TabItem title="Chain Accounts" key="Chain Accounts">
              <Box margin={'$4'} />
              <ChainFungibleAccountTable
                fungibleName={router.query.fungible as string}
                accountName={router.query.account as string}
                chainAccounts={
                  data.fungibleAccount.chainAccounts as ChainFungibleAccount[]
                }
              />
            </TabItem>

            <TabItem title="Transfers" key="Transfers">
              <Box margin={'$4'} />
              <CompactTransfersTable
                description="All transfers from or to this account"
                fungibleName={router.query.fungible as string}
                accountName={router.query.account as string}
                transfers={
                  data.fungibleAccount
                    .transfers as FungibleAccountTransfersConnection
                }
              />
            </TabItem>
            <TabItem title="Transactions" key="Transactions">
              <Box margin={'$4'} />
              <CompactTransactionsTable
                viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                  router.query.fungible as string
                }/${router.query.account as string}`}
                transactions={
                  data.fungibleAccount
                    .transactions as FungibleAccountTransactionsConnection
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
