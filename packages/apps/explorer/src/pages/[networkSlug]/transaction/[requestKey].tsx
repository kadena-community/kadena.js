import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import { cardClass } from '@/components/AccountCard/style.css';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutHeader } from '@/components/Layout/components/LayoutHeader';
import { Layout } from '@/components/Layout/Layout';
import { loadingTransactionData } from '@/components/LoadingSkeleton/loadingData/loadingDataTransactionRequestKeyQuery';
import { ValueLoader } from '@/components/LoadingSkeleton/ValueLoader/ValueLoader';
import { NoSearchResults } from '@/components/Search/NoSearchResults/NoSearchResults';
import { useToast } from '@/components/Toast/ToastContext/ToastContext';
import { TransactionRequestComponent } from '@/components/TransactionComponents/TransactionRequestComponent';
import { TransactionResultComponent } from '@/components/TransactionComponents/TransactionResultComponent';
import { useQueryContext } from '@/context/queryContext';
import { useSearch } from '@/context/searchContext';
import { transactionRequestKey } from '@/graphql/pages/transaction/transaction-requestkey.graph';
import { useRouter } from '@/hooks/router';
import { Card, TabItem, Tabs } from '@kadena/kode-ui';
import React, { useEffect, useState } from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();
  const { setIsLoading, isLoading } = useSearch();
  const [innerData, setInnerData] = useState<TransactionRequestKeyQuery>(
    loadingTransactionData,
  );
  const { setQueries } = useQueryContext();

  const transactionRequestKeyQueryVariables = {
    requestKey: router.query.requestKey as string,
  };

  const { addToast } = useToast();
  const { loading, data, error } = useTransactionRequestKeyQuery({
    variables: transactionRequestKeyQueryVariables,
    skip: !router.query.requestKey,
  });

  useEffect(() => {
    setQueries([
      {
        query: transactionRequestKey,
        variables: transactionRequestKeyQueryVariables,
      },
    ]);
  }, []);

  useEffect(() => {
    if (loading) {
      setIsLoading(true);
      return;
    }

    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of transaction requestkey data failed',
      });
    }

    if (data) {
      setTimeout(() => {
        setIsLoading(false);
        setInnerData(data);
      }, 200);
    }
  }, [loading, data, error]);

  return (
    <Layout>
      {innerData && innerData.transaction ? (
        <>
          <LayoutHeader>
            <ValueLoader isLoading={isLoading}>Transaction Details</ValueLoader>
          </LayoutHeader>

          <LayoutAside>
            <Card className={cardClass} fullWidth>
              sdf
            </Card>
          </LayoutAside>
          <LayoutBody>
            <Tabs isCompact isContained>
              <TabItem title="Request" key="Request">
                <TransactionRequestComponent
                  isLoading={isLoading}
                  transaction={innerData.transaction}
                />
              </TabItem>
              <TabItem title="Result" key="Result">
                <TransactionResultComponent
                  isLoading={isLoading}
                  transaction={innerData.transaction?.result}
                />
              </TabItem>
            </Tabs>
          </LayoutBody>
        </>
      ) : (
        <NoSearchResults />
      )}
    </Layout>
  );
};

export default Transaction;
