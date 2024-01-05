import { useGetTransactionsQuery } from '@/__generated__/sdk';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { NONFUNGIBLETRANSACTION } from '@/constants/non-fungible';
import routes from '@/constants/routes';
import { getTransactions } from '@/graphql/queries.graph';
import { Box, Breadcrumbs, Stack } from '@kadena/react-ui';
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
  });

  const accountOverviewUrl =
    router.query.fungible === NONFUNGIBLETRANSACTION
      ? `${routes.ACCOUNT}/non-fungible/${router.query.account as string}`
      : `${routes.ACCOUNT}/${router.query.fungible as string}/${
          router.query.account as string
        }`;

  return (
    <>
      <Stack justifyContent="space-between">
        <Breadcrumbs.Root>
          <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
          <Breadcrumbs.Item href={accountOverviewUrl}>
            Account Overview
          </Breadcrumbs.Item>
          <Breadcrumbs.Item>Transactions</Breadcrumbs.Item>
        </Breadcrumbs.Root>
        <GraphQLQueryDialog queries={[{ query: getTransactions, variables }]} />
      </Stack>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving transactions..."
      />

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
