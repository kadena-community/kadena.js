import type { AccountQuery } from '@/__generated__/sdk';
import { useAccountQuery } from '@/__generated__/sdk';
import AccountTransfersTable from '@/components/account-transfers-table/account-transfers-table';
import CompactTable from '@/components/compact-table/compact-table';
import Layout from '@/components/layout/layout';
import { loadingData } from '@/components/loading-skeleton/loading-data/loading-data-accountquery';
import ValueLoader from '@/components/loading-skeleton/value-loader/value-loader';
import { useRouter } from '@/components/routing/useRouter';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import { useQueryContext } from '@/context/query-context';
import { account } from '@/graphql/queries/account.graph';
import { accountNameTextClass } from '@/styles/account.css';
import { Heading, Stack, TabItem, Tabs, Text } from '@kadena/kode-ui';
import type { FC, Key } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export interface IKeyProps {
  chainId: string;
  key: string;
  predicate: string;
}

const Account: FC = () => {
  const router = useRouter();
  const [innerData, setInnerData] = useState<AccountQuery>(loadingData);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<string>('Transactions');
  const accountName = router.query.accountName as string;
  const { setQueries } = useQueryContext();

  const accountQueryVariables = {
    accountName,
  };

  const { addToast } = useToast();
  const { loading, data, error } = useAccountQuery({
    variables: accountQueryVariables,
    skip: !router.query.accountName,
  });

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of account failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  useEffect(() => {
    if (accountName) {
      setQueries([{ query: account, variables: accountQueryVariables }]);
    }
  }, [accountName]);

  useEffect(() => {
    const hash = router.asPath.split('#')[1];

    if (hash) {
      setSelectedTab(hash);
    }
  }, [router.asPath]);

  const handleSelectedTab = (tab: Key): void => {
    setSelectedTab(tab as string);

    const regExp = new RegExp(/[?#].*/);

    const newUrl = `/${router.activeNetwork.networkId}${router.asPath.replace(regExp, '')}#${tab}`;

    window.history.replaceState(
      { ...window.history.state, as: newUrl, url: newUrl },
      '',
      newUrl,
    );
  };

  const { fungibleAccount } = innerData ?? {};

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
      <Stack padding="md" width="100%" flexDirection="column">
        <ValueLoader isLoading={isLoading}>
          <Heading as="h5">
            {parseFloat(fungibleAccount?.totalBalance).toFixed(2)} KDA spread
            across {fungibleAccount?.chainAccounts.length} Chains for account{' '}
          </Heading>
        </ValueLoader>
        <Stack
          marginBlockStart="xs"
          width="100%"
          style={{ maxWidth: `calc(100% - 15px)` }}
        >
          <ValueLoader isLoading={isLoading}>
            <Text as="span" className={accountNameTextClass}>
              {fungibleAccount?.accountName}
            </Text>
          </ValueLoader>
        </Stack>
      </Stack>

      <CompactTable
        isLoading={isLoading}
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

      <Stack
        width="100%"
        gap="md"
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1} flexDirection="column" marginBlockStart="lg">
          <Tabs selectedKey={selectedTab} onSelectionChange={handleSelectedTab}>
            {/* TODO enable when index for sender is fixed */}
            {/* <TabItem
              title={`Transactions`}
              key="Transactions"
            >
              <AccountTransactionsTable accountName={accountName} />
            </TabItem> */}
            <TabItem
              title={`Transfers (${fungibleAccount?.transfers.totalCount})`}
              key="Transfers"
            >
              <AccountTransfersTable accountName={accountName} />
            </TabItem>
          </Tabs>
        </Stack>
      </Stack>
    </Layout>
  );
};

export default Account;
