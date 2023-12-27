import { useGetTransfersQuery } from '@/__generated__/sdk';
import { ExtendedTransfersTable } from '@/components/extended-transfers-table/extended-transfers-table';
import { GraphQLQueryDialog } from '@/components/graphql-query-dialog/graphql-query-dialog';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import { getTransfers } from '@/graphql/queries.graph';
import routes from '@constants/routes';
import { Box, Breadcrumbs } from '@kadena/react-ui';
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
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          href={`${routes.ACCOUNT}/${router.query.fungible as string}/${
            router.query.account as string
          }`}
        >
          Account Overview
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transfers</Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <GraphQLQueryDialog queries={[getTransfers]} variables={variables} />

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
