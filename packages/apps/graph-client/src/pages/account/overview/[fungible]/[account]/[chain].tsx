import type {
  FungibleChainAccountTransactionsConnection,
  FungibleChainAccountTransfersConnection,
} from '@/__generated__/sdk';
import { useGetFungibleChainAccountQuery } from '@/__generated__/sdk';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getFungibleChainAccount } from '@/graphql/queries.graph';
import { CompactTransactionsTable } from '@components/compact-transactions-table/compact-transactions-table';
import { CompactTransfersTable } from '@components/compact-transfers-table/compact-transfers-table';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Grid,
  GridItem,
  Notification,
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

  const { loading, data, error } = useGetFungibleChainAccountQuery({
    variables,
    skip:
      !router.query.fungible || !router.query.account || !router.query.chain,
  });

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
        <GraphQLQueryDialog
          queries={[{ query: getFungibleChainAccount, variables }]}
        />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving account information..."
      />

      {!loading && !error && !data?.fungibleChainAccount && (
        <Notification intent="info" role="status">
          We could not find any data on this account. Please check the fungible
          name, account name and chain.
        </Notification>
      )}

      {data?.fungibleChainAccount && (
        <>
          <Table.Root wordBreak="break-all">
            <Table.Body>
              <Table.Tr>
                <Table.Td>
                  <strong>Account Name</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.accountName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Fungible</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.fungibleName}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Chain</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.chainId}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Balance</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.balance}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Predicate</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.guard.predicate}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>
                  <strong>Guard Keys</strong>
                </Table.Td>
                <Table.Td>{data.fungibleChainAccount.guard.keys}</Table.Td>
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
                  data.fungibleChainAccount
                    .transfers as FungibleChainAccountTransfersConnection
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
                  data.fungibleChainAccount
                    .transactions as FungibleChainAccountTransactionsConnection
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
