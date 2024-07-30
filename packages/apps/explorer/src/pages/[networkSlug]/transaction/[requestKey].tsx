import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
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
import { truncateValues } from '@/services/format';
import { Heading, Stack, TabItem, Tabs } from '@kadena/kode-ui';
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
      {data && data.transaction ? (
        <>
          <Stack margin="md">
            <Heading as="h1" className="truncate">
              <ValueLoader isLoading={isLoading}>
                Transaction{' '}
                {truncateValues(innerData.transaction?.hash, {
                  length: 16,
                  endChars: 5,
                })}
              </ValueLoader>
            </Heading>
          </Stack>

          <Tabs>
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
        </>
      ) : (
        <NoSearchResults />
      )}
    </Layout>
  );
};

export default Transaction;
