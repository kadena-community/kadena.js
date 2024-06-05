import { useTransactionQuery } from '@/__generated__/sdk';

import { TransactionRequestComponent } from '@/components/transaction-components/transaction-request-component';
import { TransactionResultComponent } from '@/components/transaction-components/transaction-result-component';
import { useRouter } from 'next/router';
import React from 'react';

const Transaction: React.FC = () => {
  const router = useRouter();

  const { loading, data, error } = useTransactionQuery({
    variables: {
      requestKey: router.query.requestKey as string,
    },
    skip: !router.query.requestKey,
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && data.transaction && (
        <>
          <h1>Transaction {data.transaction.hash}</h1>

          <h2>Request</h2>
          <TransactionRequestComponent
            transaction={{
              id: data.transaction.id,
              hash: data.transaction.hash,
              cmd: data.transaction.cmd,
            }}
          />

          <hr />

          <h2>Result</h2>
          <TransactionResultComponent
            transactionResult={data.transaction.result}
          />
        </>
      )}
    </>
  );
};

export default Transaction;
