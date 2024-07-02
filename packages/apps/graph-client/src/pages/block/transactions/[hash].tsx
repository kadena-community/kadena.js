import { useGetTransactionsQuery } from '@/__generated__/sdk';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { getTransactions } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Notification,
  Stack,
} from '@kadena/kode-ui';
import { useRouter } from 'next/router';
import React from 'react';

const BlockTransactions: React.FC = () => {
  const router = useRouter();

  const variables = { blockHash: router.query.hash as string, first: 10 };

  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables,
    skip: !router.query.hash,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem
            href={`${routes.BLOCK_OVERVIEW}/${router.query.hash as string}`}
          >
            Block Overview
          </BreadcrumbsItem>
          <BreadcrumbsItem>Transactions</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog queries={[{ query: getTransactions, variables }]} />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving transactions..."
      />

      {!loading && !error && !data?.transactions?.edges.length && (
        <Notification intent="info" role="status">
          We could not find any transactions on this block.
        </Notification>
      )}

      {data?.transactions?.edges.length && (
        <ExtendedTransactionsTable
          transactions={data.transactions}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

export default BlockTransactions;
