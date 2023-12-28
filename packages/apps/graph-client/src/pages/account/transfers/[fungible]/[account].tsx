import { useGetTransfersQuery } from '@/__generated__/sdk';
import { ExtendedTransfersTable } from '@/components/extended-transfers-table/extended-transfers-table';
import LoaderAndError from '@/components/loader-and-error/loader-and-error';
import routes from '@constants/routes';
import { Box, Breadcrumbs } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const AccountTransfers: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransfersQuery({
    variables: {
      fungibleName: router.query.fungible as string,
      accountName: router.query.account as string,
      ...(router.query.chain && { chainId: router.query.chain as string }),
      first: 10,
    },
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
