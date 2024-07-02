import { useGetTransactionsQuery } from '@/__generated__/sdk';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { NON_FUNGIBLE_TRANSACTION } from '@/constants/non-fungible';
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

const AccountTransactions: React.FC = () => {
  const router = useRouter();

  const variables = {
    fungibleName: router.query.fungible as string,
    accountName: router.query.account as string,
    ...(router.query.chain && { chainId: router.query.chain as string }),
    first: 10,
  };

  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables,
    skip: !router.query.fungible || !router.query.account,
  });

  const accountOverviewUrl =
    router.query.fungible === NON_FUNGIBLE_TRANSACTION
      ? `${routes.ACCOUNT}/non-fungible/${router.query.account as string}`
      : `${routes.ACCOUNT}/${router.query.fungible as string}/${
          router.query.account as string
        }`;

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem href={accountOverviewUrl}>
            Account Overview
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
          We could not find any transactions with these parameters.
        </Notification>
      )}

      {data?.transactions && (
        <ExtendedTransactionsTable
          transactions={data.transactions}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

export default AccountTransactions;
