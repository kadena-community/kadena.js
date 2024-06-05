import DataRenderComponent from '@/components/data-render-component/data-render-component';
import React from 'react';

export const TransactionRequestComponent: React.FC<{ transaction: any; }> = ({
  transaction,
}) => {
  return (
    <>
      <DataRenderComponent
        fields={[
          { key: 'Request Key (hash)', value: transaction.hash },
          { key: 'Code', value: JSON.parse(transaction.cmd.payload.code) },
          {
            key: 'Data',
            value: JSON.stringify(
              JSON.parse(transaction.cmd.payload.data),
              null,
              2
            ),
          },
        ]} />

      <DataRenderComponent
        title="General"
        fields={[
          { key: 'Created', value: transaction.cmd.meta.creationTime },
          { key: 'Chain', value: transaction.cmd.meta.chainId },
          { key: 'Gas Limit', value: transaction.cmd.meta.gasLimit },
          { key: 'Gas Price', value: transaction.cmd.meta.gasPrice },
          { key: 'TTL', value: transaction.cmd.meta.ttl },
          { key: 'Sender', value: transaction.cmd.meta.sender },
          { key: 'Nonce', value: JSON.parse(transaction.cmd.nonce) },
        ]} />
      <DataRenderComponent
        title="Signers"
        fields={[...transaction.cmd.signers, ...transaction.cmd.signers]
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((signer) => [
            {
              key: 'Public key',
              value: signer.pubkey,
            },
            {
              key: 'Capabilities',
              value: (
                <DataRenderComponent
                  fields={signer.clist.map((capability) => ({
                    key: capability.name,
                    value: JSON.parse(capability.args).map((n, i) => (
                      <p key={i}>{n}</p>
                    )),
                  }))} />
              ),
            },
          ])
          .flat()} />
    </>
  );
};
