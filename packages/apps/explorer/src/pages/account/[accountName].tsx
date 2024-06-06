import type { Transaction, Transfer } from '@/__generated__/sdk';
import { useAccountQuery } from '@/__generated__/sdk';
import type { IKeyProps } from '@/components/compact-keys-table/compact-keys-table';
import CompactKeysTable from '@/components/compact-keys-table/compact-keys-table';
import CompactTable from '@/components/compact-table/compact-table';
import CompactTransfersTable from '@/components/compact-transfers-table/compact-transfers-table';
import MaskedAccountName from '@/components/mask-accountname/mask-accountname';
import { MonoArrowOutward } from '@kadena/react-icons';
import { Heading, Stack, TabItem, Tabs } from '@kadena/react-ui';
import Link from 'next/link';
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

  const { fungibleAccount } = data ?? {};

  const keys: IKeyProps[] = useMemo(() => {
    const innerKeys: IKeyProps[] =
      fungibleAccount?.chainAccounts.reduce((acc: IKeyProps[], val) => {
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
  }, [fungibleAccount?.chainAccounts]);

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <Stack margin="md">
        <Heading as="h5">
          {parseFloat(fungibleAccount?.totalBalance).toFixed(2)} KDA spread
          across {fungibleAccount?.chainAccounts.length} Chains for account{' '}
          <MaskedAccountName value={fungibleAccount?.accountName ?? ''} />
        </Heading>
      </Stack>

      {keys && (
        <CompactTable
          label="Keys table"
          fields={[
            {
              label: 'ChainId',
              key: 'chainId',
              width: '10%',
              value: ({ str }: { str: string }) => str,
            },
            {
              variant: 'code',
              label: 'Key',
              key: 'key',
              width: '50%',
              value: ({ str }: { str: string }) => str,
            },
            {
              label: 'Predicate',
              key: 'predicate',
              width: '40%',
              value: ({ str }: { str: string }) => str,
            },
          ]}
          data={keys}
        />
      )}

      {keys && <CompactKeysTable keys={keys} />}
      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1} flexDirection="column">
          <Tabs>
            <TabItem
              title={`Transactions (${fungibleAccount?.transactions.edges.length ?? 0})`}
              key="Transactions"
            >
              {fungibleAccount?.transactions && (
                <CompactTable
                  label="Keys table"
                  fields={[
                    {
                      label: 'RequestKey',
                      key: 'hash',
                      width: '10%',
                      value: ({ str }: { str: string }) => (
                        <>
                          <Link href={`/transaction/${str}`}>{str}</Link>
                          <Link href={`/transaction/${str}`}>
                            <MonoArrowOutward />
                          </Link>
                        </>
                      ),
                    },
                  ]}
                  data={fungibleAccount?.transactions.edges.map(
                    (edge) => edge.node as Transaction,
                  )}
                />
              )}
            </TabItem>
            <TabItem
              title={`Transfers (${fungibleAccount?.transfers.edges.length ?? 0})`}
              key="Transfers"
            >
              {fungibleAccount?.transfers && (
                <CompactTransfersTable
                  transfers={fungibleAccount?.transfers.edges.map(
                    (edge) => edge.node as Transfer,
                  )}
                />
              )}
            </TabItem>
          </Tabs>
        </Stack>
      </Stack>
    </>
  );
};

export default Account;
