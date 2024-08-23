import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import { LayoutAside } from '@/components/Layout/components/LayoutAside';
import { LayoutAsideContentBlock } from '@/components/Layout/components/LayoutAsideContentBlock';
import { LayoutBody } from '@/components/Layout/components/LayoutBody';
import { LayoutCard } from '@/components/Layout/components/LayoutCard';
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
import { TabItem, Tabs } from '@kadena/kode-ui';
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
            <LayoutCard>
              {innerData.transaction?.result.__typename ===
                'TransactionResult' && (
                <LayoutAsideContentBlock
                  isLoading={isLoading}
                  label="Block Height"
                  body={`${innerData.transaction?.result.block.height}`}
                />
              )}
              <LayoutAsideContentBlock
                isLoading={isLoading}
                label="Creation Time"
                body={`${innerData.transaction?.cmd.meta.creationTime}`}
              />
              <LayoutAsideContentBlock
                isLoading={isLoading}
                label="Chain"
                body={`${innerData.transaction?.cmd.meta.chainId}`}
              />
            </LayoutCard>
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
