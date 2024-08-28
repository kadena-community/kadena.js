import type { QueryTransfersConnection } from '@/__generated__/sdk';
import { useGetTransfersQuery } from '@/__generated__/sdk';
import { ExtendedTransfersTable } from '@/components/extended-transfers-table/extended-transfers-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getTransfers } from '@/graphql/queries.graph';
import routes from '@constants/routes';
import {
  Box,
  Breadcrumbs,
  BreadcrumbsItem,
  Notification,
  Stack,
} from '@kadena/kode-ui';
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
    skip: !router.query.fungible || !router.query.account,
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
          <BreadcrumbsItem>Transfers</BreadcrumbsItem>
        </Breadcrumbs>
        <GraphQLQueryDialog queries={[{ query: getTransfers, variables }]} />
      </Stack>

      <Box margin="md" />

      <LoaderAndError
        error={error}
        loading={loading}
        loaderText="Retrieving transfers..."
      />

      {!loading && !error && !data?.transfers?.edges.length && (
        <Notification intent="info" role="status">
          We could not find any transfers with these parameters.
        </Notification>
      )}

      {data?.transfers && (
        <ExtendedTransfersTable
          transfers={data.transfers as QueryTransfersConnection}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

export default AccountTransfers;
