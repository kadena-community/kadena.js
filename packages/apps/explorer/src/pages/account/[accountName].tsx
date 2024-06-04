import { useTransactionsQuery } from '@/__generated__/sdk';
import Balance from '@/components/balance/balance';
import ChainOverview from '@/components/chain-overview/chain-overview';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useState } from 'react';

const Account: FC = () => {
  const router = useRouter();
  const [selectedChain, setSelectedChain] = useState<number | undefined>(
    undefined,
  );
  const { loading, data, error } = useTransactionsQuery({
    variables: {
      accountName: router.query.accountName as string,
    },
    skip: !router.query.accountName,
  });

  const handleChainHover = (chainId: number) => {
    setSelectedChain(chainId);
  };

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <ChainOverview onHover={handleChainHover} />
      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1}>1</Stack>
        <Stack flexDirection="column" gap="md">
          <Stack>
            <Balance chainId={selectedChain} />
          </Stack>
          <Stack>
            <Balance />
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default Account;
