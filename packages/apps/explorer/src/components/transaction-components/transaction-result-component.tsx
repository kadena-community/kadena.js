import type {
  TransactionMempoolInfo,
  TransactionRequestKeyQuery,
  Transfer,
} from '@/__generated__/sdk';
import DataRenderComponent from '@/components/data-render-component/data-render-component';
import { Text } from '@kadena/react-ui';
import React, { useEffect } from 'react';
import { ifNill } from '../../utils/ifNill';

type TransactionResult = Exclude<
  TransactionRequestKeyQuery['transaction'],
  undefined | null
>['result'];

export const TransactionResultComponent: React.FC<{
  transactionResult: TransactionResult;
}> = ({ transactionResult }) => {
  const [crosschainTransfer, setCrosschainTransfer] =
    React.useState<Transfer>();

  useEffect(() => {
    if (
      transactionResult &&
      transactionResult.__typename === 'TransactionResult'
    ) {
      const xchainTx = getCrosschainTransfer(transactionResult);
      setCrosschainTransfer(xchainTx);
    }
  }, [transactionResult]);

  if (transactionResult.__typename !== 'TransactionResult') {
    return null;
  }

  return (
    <>
      <DataRenderComponent
        title="Block"
        fields={[
          { key: 'Height', value: transactionResult.block.height },
          {
            key: 'Hash',
            value: transactionResult.block.hash,
            link: `/block/${transactionResult.block.hash}`,
          },
          { key: 'Created', value: transactionResult.block.creationTime },
        ]}
      />

      {transactionResult.__typename === 'TransactionResult' &&
        crosschainTransfer && (
          <DataRenderComponent
            title="Crosschain Transfer"
            fields={[
              {
                key: 'Type',
                // note: this might be confusing
                //   where the COUNTERPART SENDER is empty, the COUNTERPART is
                //   the minting transaction (finisher transaction)
                // That makes the CURRENT transaction the sender
                value:
                  getCrosschainTransfer(
                    transactionResult,
                  ).senderAccount.trim() === ''
                    ? 'Initiation transaction'
                    : 'Finisher transaction',
              },
              {
                key: 'Counterpart',
                value: getCrosschainTransfer(transactionResult).requestKey,
                link: `/transaction/${getCrosschainTransfer(transactionResult).requestKey}`,
              },
            ]}
          />
        )}

      <DataRenderComponent
        title="Result"
        fields={[
          {
            key: 'Result',
            value:
              transactionResult.badResult !== null
                ? `Failed: ${ifNill(transactionResult.badResult, '')}`
                : `Success: ${ifNill(transactionResult.goodResult, '')}`,
          },
          { key: 'Logs', value: transactionResult.logs },
          { key: 'Gas', value: transactionResult.gas },
          { key: 'Transaction ID', value: transactionResult.transactionId },
          {
            key: 'Continuation',
            value: (
              <DataRenderComponent
                fields={objectToDataRenderComponentFields({
                  ...JSON.parse(transactionResult.continuation ?? '[]'),
                })}
              />
            ),
          },
          { key: 'Metadata', value: transactionResult.metadata },
        ]}
      />

      <DataRenderComponent
        title="Events"
        fields={
          transactionResult.events.edges
            .map(
              (edge) =>
                edge && {
                  key: edge.node.qualifiedName,
                  value: mapParameters(edge.node.parameters),
                },
            )
            .filter(Boolean) as { key: string; value: string }[]
        }
      />
    </>
  );
};

function mapParameters(
  parameters: string | null | undefined,
): string | React.JSX.Element {
  if (!parameters) return '';
  try {
    return (
      <>
        {(JSON.parse(parameters) as unknown[]).map((param) => {
          if (typeof param === 'object') {
            // eslint-disable-next-line react/jsx-key
            return <Text variant="code">{JSON.stringify(param)}</Text>;
          }
          if (typeof param === 'string') {
            // eslint-disable-next-line react/jsx-key
            return <Text variant="code">{param}</Text>;
          }
          // eslint-disable-next-line react/jsx-key
          return <Text variant="code">{JSON.stringify(param)}</Text>;
        })}
      </>
    );
  } catch {
    return parameters;
  }
}

function objectToDataRenderComponentFields(
  obj: Record<string, unknown>,
): { key: string; value: string }[] {
  return Object.entries(obj).map(([key, value]) => ({
    key,
    value: JSON.stringify(value),
  }));
}

type TransactionMempoolOrResult = Exclude<
  TransactionRequestKeyQuery['transaction'],
  undefined | null
>['result'];

type TxResult = Exclude<TransactionMempoolOrResult, TransactionMempoolInfo>;

function getCrosschainTransfer(transaction: TxResult): Transfer {
  return transaction.transfers.edges.find(
    (edge) => edge?.node.crossChainTransfer !== null,
  )?.node.crossChainTransfer as Transfer;
}
