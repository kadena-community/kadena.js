import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import Layout from '@/components/layout/layout';
import { TransactionRequestComponent } from '@/components/transaction-components/transaction-request-component';
import { TransactionResultComponent } from '@/components/transaction-components/transaction-result-component';
import { useQueryContext } from '@/context/query-context';
import { transactionRequestKey } from '@/graphql/pages/transaction/transaction-requestkey.graph';
import { truncateValues } from '@/services/format';
import { Heading, Stack, TabItem, Tabs } from '@kadena/kode-ui';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();

  const { setQueries } = useQueryContext();

  const transactionRequestKeyQueryVariables = {
    requestKey: router.query.requestKey as string,
  };

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

  return (
    <Layout>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
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
