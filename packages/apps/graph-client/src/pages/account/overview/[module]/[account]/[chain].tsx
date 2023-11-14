import type {
  ChainModuleAccountTransactionsConnection,
  ChainModuleAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetChainAccountQuery } from '@/__generated__/sdk';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Grid, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const ChainAccount: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useGetChainAccountQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
      chainId: router.query.chain as string,
    },
  });

  return (
    <>
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

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {data?.chainAccount && (
        <>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Module</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.moduleName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.chainId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Balance</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.balance}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Predicate</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.guard.predicate}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Keys</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.guard.keys}</Table.Td>
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
                truncateColumns={true}
                transfers={
                  data.chainAccount
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
                truncateColumns={true}
                transactions={
                  data.chainAccount
                    .transactions as ChainModuleAccountTransactionsConnection
                }
              />
            </Grid.Item>
          </Grid.Root>
        </>
      )}
    </>
  );
};

export default ChainAccount;
