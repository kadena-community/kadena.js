import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import Layout from '@/components/layout/layout';
import { useRouter } from '@/components/routing/useRouter';
import { useToast } from '@/components/toasts/toast-context/toast-context';
import { TransactionRequestComponent } from '@/components/transaction-components/transaction-request-component';
import { TransactionResultComponent } from '@/components/transaction-components/transaction-result-component';
import { useQueryContext } from '@/context/query-context';
import { transactionRequestKey } from '@/graphql/pages/transaction/transaction-requestkey.graph';
import { truncateValues } from '@/services/format';
import { Heading, Stack, TabItem, Tabs } from '@kadena/kode-ui';
import React, { useEffect } from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();

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
    if (error) {
      addToast({
        type: 'negative',
        label: 'Something went wrong',
        body: 'Loading of transaction requestkey data failed',
      });
    }
  }, [error]);

  return (
    <Layout>
      {!loading && (!data || !data.transaction) ? (
        <p>Transaction not found</p>
      ) : null}
      {data && data.transaction && (
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
      )}
    </Layout>
  );
};

export default Transaction;
