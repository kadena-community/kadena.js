import type {
  ChainFungibleAccountTransactionsConnection,
  ChainFungibleAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetChainAccountQuery } from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getChainAccount } from '@/graphql/queries.graph';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs
  BreadcrumbsItem,
  Grid,
  GridItem,
  Stack,
  Table,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const ChainAccount: React.FC = () => {
  const router = useRouter();

  const variables = {
    fungibleName: router.query.fungible as string,
    accountName: router.query.account as string,
    chainId: router.query.chain as string,
  };

  const { loading, data, error } = useGetChainAccountQuery({ variables });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem
            href={`${routes.ACCOUNT}/${router.query.fungible as string}/${
              router.query.account as string
            }`}
          >
            Account Overview
          </BreadcrumbsItem>
          <BreadcrumbsItem>Chain</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog queries={[{ query: getChainAccount, variables }]} />
      </Stack>

      <Box margin="md" />

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
                  <strong>Fungible</strong>
                </Table.Td>
                <Table.Td>{data.chainAccount.fungibleName}</Table.Td>
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
          <Box margin="md" />
          <Grid columns={2} gap="lg">
            <GridItem>
              <CompactTransfersTable
                fungibleName={router.query.fungible as string}
                accountName={router.query.account as string}
                chainId={router.query.chain as string}
                truncateColumns={true}
                transfers={
                  data.chainAccount
                    .transfers as ChainFungibleAccountTransfersConnection
                }
              />
            </GridItem>
            <GridItem>
              <CompactTransactionsTable
                viewAllHref={`${routes.ACCOUNT_TRANSACTIONS}/${
                  router.query.fungible as string
                }/${router.query.account as string}?chain=${
                  router.query.chain as string
                }`}
                truncateColumns={true}
                transactions={
                  data.chainAccount
                    .transactions as ChainFungibleAccountTransactionsConnection
                }
              />
            </GridItem>
          </Grid>
        </>
      )}
    </>
  );
};

export default ChainAccount;
