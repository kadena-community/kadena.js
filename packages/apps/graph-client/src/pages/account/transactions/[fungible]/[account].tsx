import { useGetTransactionsQuery } from '@/__generated__/sdk';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@/constants/routes';
import { getTransactions } from '@/graphql/queries.graph';
import {
  Box,
  Breadcrumbs
  BreadcrumbsItem,
  Stack,
} from '@kadena/react-ui';
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
