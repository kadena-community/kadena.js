import { useTransactionsQuery } from '@/__generated__/sdk';
import ChainOverview from '@/components/chain-overview/chain-overview';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

const Account: FC = () => {
  const router = useRouter();
  const { loading, data, error } = useTransactionsQuery({
    variables: {
      accountName: router.query.accountName as string,
    },
    skip: !router.query.accountName,
  });

  console.log({ data });

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <ChainOverview />
      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1}>1</Stack>
        <Stack flexDirection="column" gap="md">
          <Stack>2</Stack>
          <Stack>3</Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Account;
