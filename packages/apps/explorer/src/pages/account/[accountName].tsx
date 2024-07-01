import type { Transaction, Transfer } from '@/__generated__/sdk';
import { useAccountQuery } from '@/__generated__/sdk';
import CompactTable from '@/components/compact-table/compact-table';
import { FormatAccount } from '@/components/compact-table/utils/format-account';
import { FormatAmount } from '@/components/compact-table/utils/format-amount';
import { FormatLink } from '@/components/compact-table/utils/format-link';
import { FormatStatus } from '@/components/compact-table/utils/format-status';
import Layout from '@/components/layout/layout';
import { useQueryContext } from '@/context/query-context';
import { account } from '@/graphql/queries/account.graph';
import { accountNameTextClass } from '@/styles/account.css';
import { Heading, Stack, TabItem, Tabs, Text } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import type { FC, Key } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export interface IKeyProps {
  chainId: string;
  key: string;
  predicate: string;
}

const Account: FC = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<string>('Transactions');

  const { setQueries } = useQueryContext();

  const accountQueryVariables = {
    accountName: router.query.accountName as string,
  };

  const { loading, data, error } = useAccountQuery({
    variables: accountQueryVariables,
    skip: !router.query.accountName,
  });

  useEffect(() => {
    if (router.query.accountName) {
      setQueries([{ query: account, variables: accountQueryVariables }]);
    }
  }, [router.query.accountName]);

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setSelectedTab(hash);
    }
  }, [router.asPath]);

  const handleSelectedTab = (tab: Key): void => {
    setSelectedTab(tab as string);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`#${tab}`);
  };

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
    <Layout>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <Stack margin="md">
        <Heading as="h5">
          {parseFloat(fungibleAccount?.totalBalance).toFixed(2)} KDA spread
          across {fungibleAccount?.chainAccounts.length} Chains for account{' '}
          <div style={{ display: 'flex', maxWidth: `calc(100% - 15px)` }}>
            <Text as="span" className={accountNameTextClass}>
              {fungibleAccount?.accountName}
            </Text>
          </div>
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
            },
            {
              variant: 'code',
              label: 'Key',
              key: 'key',
              width: '50%',
            },
            {
              label: 'Predicate',
              key: 'predicate',
              width: '40%',
            },
          ]}
          data={keys}
        />
      )}
      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1} flexDirection="column" marginBlockStart="lg">
          <Tabs selectedKey={selectedTab} onSelectionChange={handleSelectedTab}>
            <TabItem
              title={`Transactions (${fungibleAccount?.transactions.edges.length ?? 0})`}
              key="Transactions"
            >
              {fungibleAccount?.transactions && (
                <CompactTable
                  label="Keys table"
                  fields={[
                    {
                      label: 'Status',
                      key: 'result.goodResult',
                      variant: 'code',
                      width: '10%',
                      render: FormatStatus(),
                    },
                    {
                      label: 'Sender',
                      key: 'cmd.meta.sender',
                      variant: 'code',
                      width: '25%',
                    },
                    {
                      label: 'RequestKey',
                      key: 'hash',
                      variant: 'code',
                      width: '25%',
                      render: FormatLink({ appendUrl: '/transaction' }),
                    },
                    {
                      label: 'Code Preview',
                      key: 'cmd.payload.code',
                      variant: 'code',
                      width: '40%',
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
                <CompactTable
                  fields={[
                    {
                      label: 'Height',
                      key: 'height',
                      variant: 'code',
                      width: '10%',
                    },
                    {
                      label: 'ChainId',
                      key: 'chainId',
                      variant: 'code',
                      width: '10%',
                    },
                    {
                      label: 'Amount',
                      key: 'amount',
                      width: '20%',
                      render: FormatAmount(),
                    },
                    {
                      label: 'Sender',
                      key: 'senderAccount',
                      width: '20%',
                      render: FormatAccount(),
                    },
                    {
                      label: 'Receiver',
                      key: 'receiverAccount',
                      width: '20%',
                      render: FormatAccount(),
                    },
                    {
                      label: 'RequestKey',
                      key: 'requestKey',
                      width: '20%',
                    },
                  ]}
                  data={fungibleAccount?.transfers.edges.map(
                    (edge) => edge.node as Transfer,
                  )}
                />
              )}
            </TabItem>
          </Tabs>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Account;
