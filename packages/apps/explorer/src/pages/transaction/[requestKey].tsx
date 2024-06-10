import { useTransactionRequestKeyQuery } from '@/__generated__/sdk';
import DetailLayout from '@/components/layout/detail-layout/detail-layout';
import { TransactionRequestComponent } from '@/components/transaction-components/transaction-request-component';
import { TransactionResultComponent } from '@/components/transaction-components/transaction-result-component';
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
          <h1>Transaction {data.transaction.hash}</h1>

          <h2>Request</h2>
          <TransactionRequestComponent transaction={data.transaction} />

          <hr />

          <h2>Result</h2>
          <TransactionResultComponent
            transactionResult={data.transaction.result}
          />
        </>
      )}
    </DetailLayout>
  );
};

export default Transaction;
