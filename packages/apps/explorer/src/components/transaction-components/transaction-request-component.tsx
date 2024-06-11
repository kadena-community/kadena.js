import type { TransactionRequestKeyQuery } from '@/__generated__/sdk';
import DataRenderComponent from '@/components/data-render-component/data-render-component';
import { ifNill } from '@/utils/ifNill';
import React from 'react';

type Transaction = Omit<
  Exclude<TransactionRequestKeyQuery['transaction'], undefined | null>,
  'result'
>;

export const TransactionRequestComponent: React.FC<{
  transaction: Transaction;
}> = ({ transaction }) => {
  return (
    <>
      {transaction.cmd.payload.__typename === 'ExecutionPayload' ? (
        // Execution transaction

        <DataRenderComponent
          fields={[
            { key: 'Request Key (hash)', value: transaction.hash },
            {
              key: 'Env Data',
              value: JSON.stringify(
                JSON.parse(transaction.cmd.payload.data),
                null,
                2,
              ),
            },
            {
              key: 'Code',
              value: JSON.parse(transaction.cmd.payload.code ?? ''),
            },
          ]}
        />
      ) : transaction.cmd.payload.__typename === 'ContinuationPayload' ? (
        // Continuation

        <DataRenderComponent
          fields={[
            { key: 'Request Key (hash)', value: transaction.hash },
            {
              key: 'Data',
              value: JSON.stringify(
                JSON.parse(transaction.cmd.payload.data),
                null,
                2,
              ),
            },
            {
              key: 'Pact ID',
              value: ifNill(transaction.cmd.payload.pactId, ''),
            },
            {
              key: 'Proof',
              value: ifNill(transaction.cmd.payload.proof, ''),
            },
            {
              key: 'Rollback',
              value: JSON.stringify(transaction.cmd.payload.rollback),
            },
            {
              key: 'Step',
              value: JSON.stringify(transaction.cmd.payload.step),
            },
          ]}
        />
      ) : null}

      <DataRenderComponent
        title="General"
        fields={[
          { key: 'Chain', value: transaction.cmd.meta.chainId },
          { key: 'Created', value: transaction.cmd.meta.creationTime },
          { key: 'TTL', value: transaction.cmd.meta.ttl },
          {
            key: 'Sender',
            value: transaction.cmd.meta.sender,
            link: `/account/${transaction.cmd.meta.sender}`,
          },
          { key: 'Gas Limit', value: transaction.cmd.meta.gasLimit },
          { key: 'Gas Price', value: transaction.cmd.meta.gasPrice },
          { key: 'Nonce', value: transaction.cmd.nonce },
        ]}
      />

      <DataRenderComponent
        title="Signers"
        fields={transaction.cmd.signers
          // .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((signer) => [
            {
              key: 'Public key',
              value: signer.pubkey,
            },
            { key: 'Scheme', value: signer.scheme ?? '' },
            {
              key: 'Capabilities',
              value: (
                <DataRenderComponent
                  fields={signer.clist.map((capability) => ({
                    key: capability.name,
                    value: (
                      <>
                        {(JSON.parse(capability.args) as string[])
                          .map((n, i) => <p key={i}>{JSON.stringify(n)}</p>)
                          .flat()}
                      </>
                    ),
                  }))}
                />
              ),
            },
          ])
          .flat()}
      />

      <DataRenderComponent
        title="Signatures"
        fields={transaction.sigs.map((s) => ({ key: '', value: s.sig }))}
      />
    </>
  );
};
