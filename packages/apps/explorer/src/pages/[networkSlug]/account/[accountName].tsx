import type { AccountQuery } from '@/__generated__/sdk';
import { useAccountQuery } from '@/__generated__/sdk';
import { AccountAside } from '@/components/AccountAside/AccountAside';
import { AccountBalanceDistribution } from '@/components/AccountBalanceDistribution/AccountBalanceDistribution';
import { AccountTransactionsTable } from '@/components/AccountTransactionsTable/AccountTransactionsTable';
import { AccountTransfersTable } from '@/components/AccountTransfersTable/AccountTransfersTable';
import { tabsWidthClass } from '@/components/globalstyles.css';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { loadingData } from '@/components/LoadingSkeleton/loadingData/loadingDataAccountquery';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { account } from '@/graphql/queries/account.graph';
import { useRouter } from '@/hooks/router';
import {
  Badge,
  maskValue,
  Notification,
  Stack,
  TabItem,
  Tabs,
} from '@kadena/kode-ui';
import { CompactTable, CompactTableFormatters } from '@kadena/kode-ui/patterns';
import type { FC, Key } from 'react';
import React, { useEffect, useMemo, useState } from 'react';

export interface IKeyProps {
  chainId: string;
  key: string;
  predicate: string;
}

const Account: FC = () => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useSearch();
  const [innerData, setInnerData] = useState<AccountQuery>(loadingData);
  const [selectedTab, setSelectedTab] = useState<string>('Balance');
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

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    router.replace(`#${tab}`);
  };

  const { fungibleAccount } = innerData ?? {};

  const keys: IKeyProps[] = useMemo(() => {
    const innerKeys: IKeyProps[] =
      fungibleAccount?.chainAccounts.reduce((acc: IKeyProps[], val) => {
        const jsonGuard = JSON.parse(val.guard.raw ?? '{}');

        const guardKeys: IKeyProps[] = jsonGuard.keys?.map((key: any) => {
          return {
            key: key,
            balance: val.balance,
            predicate: val.guard.predicate,
            chainId: val.chainId,
          };
        }) ?? [
          {
            key: val.guard.raw,
            balance: val.balance ?? 0,
            predicate: '',
            chainId: val.chainId,
          },
        ];
        return [...acc, ...guardKeys];
      }, []) ?? [];

    return innerKeys.sort((a: IKeyProps, b: IKeyProps) => {
      if (parseInt(a.chainId, 10) < parseInt(b.chainId, 10)) return -1;
      if (parseInt(a.chainId, 10) > parseInt(b.chainId, 10)) return 1;
      return 0;
    });
  }, [fungibleAccount?.chainAccounts]);

  if (error || !fungibleAccount)
    return (
      <Layout layout="full">
        <LayoutBody>
          {!Array.isArray(accountName) && (
            <NoSearchResults type="accountName" value={accountName} />
          )}
        </LayoutBody>
      </Layout>
    );

  return (
    <Layout>
      <LayoutHeader>Account Details</LayoutHeader>
      <LayoutAside>
        <LayoutCard>
          <AccountAside isLoading={isLoading} account={fungibleAccount} />
        </LayoutCard>
      </LayoutAside>

      <LayoutBody>
        <Tabs
          className={tabsWidthClass}
          isContained
          selectedKey={selectedTab}
          onSelectionChange={handleSelectedTab}
        >
          <TabItem
            title={
              <>
                Account Guards{' '}
                <ValueLoader isLoading={isLoading} variant="icon">
                  <Badge style="highContrast" size="sm">
                    {keys.length}
                  </Badge>
                </ValueLoader>
              </>
            }
            key="Keys"
          >
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
                  width: '40%',
                },
                {
                  label: 'Predicate',
                  key: 'predicate',
                  width: '20%',
                },
                {
                  label: 'Balance',
                  key: 'balance',
                  width: '30%',
                  align: 'end',
                  render: CompactTableFormatters.FormatAmount(),
                },
              ]}
              data={keys}
            />
          </TabItem>
          <TabItem title="Balance Distribution" key="Balance">
            <AccountBalanceDistribution
              accountName={accountName}
              chains={fungibleAccount.chainAccounts ?? []}
            />
          </TabItem>
          <TabItem title={`Transfers`} key="Transfers">
            <AccountTransfersTable accountName={accountName} />
          </TabItem>
          <TabItem title={`Transactions`} key="Transactions">
            <Stack flexDirection="column" gap="md">
              <Notification role="status" type="inlineStacked">
                All transactions in which account {maskValue(accountName)} acted
                as the sender and covered the gas fees.
              </Notification>
              <AccountTransactionsTable accountName={accountName} />
            </Stack>
          </TabItem>
        </Tabs>
      </LayoutBody>
    </Layout>
  );
};

export default Account;
