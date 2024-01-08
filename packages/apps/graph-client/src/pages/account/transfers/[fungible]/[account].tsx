import { useGetTransfersQuery } from '@/__generated__/sdk';
import { ExtendedTransfersTable } from '@/components/extended-transfers-table/extended-transfers-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getTransfers } from '@/graphql/queries.graph';
import routes from '@constants/routes';
import {
  Box,
  BreadcrumbsContainer,
  BreadcrumbsItem,
  Stack,
} from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const AccountTransfers: React.FC = () => {
  const router = useRouter();

  const variables = {
    fungibleName: router.query.fungible as string,
    accountName: router.query.account as string,
    ...(router.query.chain && { chainId: router.query.chain as string }),
    first: 10,
  };

  const { loading, data, error, fetchMore } = useGetTransfersQuery({
    variables,
  });

  return (
    <>
      <Stack justifyContent="space-between">
        <BreadcrumbsContainer>
          <BreadcrumbsItem href={`${routes.HOME}`}>Home</BreadcrumbsItem>
          <BreadcrumbsItem
            href={`${routes.ACCOUNT}/${router.query.fungible as string}/${
              router.query.account as string
            }`}
          >
            Account Overview
          </BreadcrumbsItem>
          <BreadcrumbsItem>Transfers</BreadcrumbsItem>
        </BreadcrumbsContainer>
        <GraphQLQueryDialog queries={[{ query: getTransfers, variables }]} />
      </Stack>

      <Box marginBottom="$8" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving transfers..."
      />

      {data?.transfers && (
        <ExtendedTransfersTable
          transfers={data.transfers}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

export default AccountTransfers;
