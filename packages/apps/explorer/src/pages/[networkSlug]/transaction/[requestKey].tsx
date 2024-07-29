import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import { Layout } from '@/components/Layout/Layout';
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
import React, { useEffect } from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();
  const { setIsLoading } = useSearch();
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
      }, 200);
    }
  }, [loading, data, error]);

  return (
    <Layout>
      {data && data.transaction ? (
        <>
          <Stack margin="md">
            <Heading as="h1" className="truncate">
              Transaction{' '}
              {truncateValues(data.transaction.hash, {
                length: 16,
                endChars: 5,
              })}
            </Heading>
          </Stack>

          <Tabs>
            <TabItem title="Request" key="Request">
              <TransactionRequestComponent transaction={data.transaction} />
            </TabItem>
            <TabItem title="Result" key="Result">
              <TransactionResultComponent
                transactionResult={data.transaction.result}
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
