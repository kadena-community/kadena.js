import { useGetTransactionsQuery } from '@/__generated__/sdk';
import LoaderAndError from '@/components/LoaderAndError/loader-and-error';
import { ExtendedTransactionsTable } from '@/components/extended-transactions-table/extended-transactions-table';
import routes from '@/constants/routes';
import { Box, Breadcrumbs } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const BlockTransactions: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransactionsQuery({
    variables: { blockHash: router.query.hash as string, first: 10 },
  });

  return (
    <>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          href={`${routes.BLOCK_OVERVIEW}/${router.query.hash as string}`}
        >
          Block Overview
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transactions</Breadcrumbs.Item>
      </Breadcrumbs.Root>

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

export default BlockTransactions;
