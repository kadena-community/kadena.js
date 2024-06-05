import type { Transaction } from '@/__generated__/sdk';
import { useAccountQuery } from '@/__generated__/sdk';
import CompactKeysTable from '@/components/compact-keys-table/compact-keys-table';
import type { IKeyProps } from '@/components/compact-keys-table/types';
import CompactTransactionsTable from '@/components/compact-transactions-table/compact-transactions-table';
import { Stack } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React, { useMemo } from 'react';

const Account: FC = () => {
  const router = useRouter();

  const { loading, data, error } = useAccountQuery({
    variables: {
      accountName: router.query.accountName as string,
    },
    skip: !router.query.accountName,
  });

  const keys: IKeyProps[] = useMemo(() => {
    const innerKeys: IKeyProps[] =
      data?.fungibleAccount?.chainAccounts.reduce((acc: IKeyProps[], val) => {
        const guardKeys: IKeyProps[] = val.guard.keys.map((key) => {
          return {
            key: key,
            predicate: val.guard.predicate,
            chainId: val.chainId,
          };
        });
        return [...acc, ...guardKeys];
      }, []) ?? [];

    return innerKeys.sort((a: IKeyProps, b: IKeyProps) => {
      if (parseInt(a.chainId, 10) < parseInt(b.chainId, 10)) return -1;
      if (parseInt(a.chainId, 10) > parseInt(b.chainId, 10)) return 1;
      return 0;
    });
  }, [data?.fungibleAccount?.chainAccounts]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      {keys && <CompactKeysTable keys={keys} />}
      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1} flexDirection="column">
          {data?.fungibleAccount?.transactions && (
            <CompactTransactionsTable
              transactions={data?.fungibleAccount?.transactions.edges.map(
                (edge) => edge.node as Transaction,
              )}
            />
          )}
        </Stack>
      </Stack>
    </>
  );
};

export default Account;
