import { useGetTransfersQuery } from '@/__generated__/sdk';
import Loader from '@/components/Common/loader/loader';
import { mainStyle } from '@/components/Common/main/styles.css';
import { ErrorBox } from '@/components/error-box/error-box';
import { ExtendedTransfersTable } from '@/components/extended-transfers-table/extended-transfers-table';
import routes from '@constants/routes';
import { Box, Breadcrumbs, Button, Link, Table } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const AccountTransfers: React.FC = () => {
  const router = useRouter();

  const { loading, data, error, fetchMore } = useGetTransfersQuery({
    variables: {
      moduleName: router.query.module as string,
      accountName: router.query.account as string,
      ...(router.query.chain && { chainId: router.query.chain as string }),
      first: 10,
    },
  });

  return (
    <div style={{ padding: '0 50px 30px 50px' }}>
      <Breadcrumbs.Root>
        <Breadcrumbs.Item href={`${routes.HOME}`}>Home</Breadcrumbs.Item>
        <Breadcrumbs.Item
          href={`${routes.ACCOUNT}/${router.query.module as string}/${
            router.query.account as string
          }`}
        >
          Account Overview
        </Breadcrumbs.Item>
        <Breadcrumbs.Item>Transfers</Breadcrumbs.Item>
      </Breadcrumbs.Root>

      <Box marginBottom="$8" />
      <main className={mainStyle}>
        <div>
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Loader /> <span>Retrieving transfers...</span>
            </div>
          )}
          {error && <ErrorBox error={error} />}
          {data?.transfers && (
            <ExtendedTransfersTable
              transfers={data.transfers}
              fetchMore={fetchMore}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AccountTransfers;
