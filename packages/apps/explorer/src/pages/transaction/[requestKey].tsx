import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import DetailLayout from '@/components/layout/detail-layout/detail-layout';
import { TransactionRequestComponent } from '@/components/transaction-components/transaction-request-component';
import { TransactionResultComponent } from '@/components/transaction-components/transaction-result-component';
import { TabItem, Tabs, maskValue } from '@kadena/react-ui';
import { useRouter } from 'next/router';
import React from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useTransactionRequestKeyQuery({
    variables: {
      requestKey: router.query.requestKey as string,
    },
    skip: !router.query.requestKey,
  });

  return (
    <DetailLayout>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {!loading && (!data || !data.transaction) ? (
        <p>Transaction not found</p>
      ) : null}
      {data && data.transaction && (
        <>
          <h1>Transaction {maskValue(data.transaction.hash)}</h1>

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
    </DetailLayout>
  );
};

export default Transaction;
