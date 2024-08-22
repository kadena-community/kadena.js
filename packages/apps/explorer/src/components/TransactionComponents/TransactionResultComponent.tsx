import type { TransactionRequestKeyQuery, Transfer } from '@/__generated__/sdk';
import { DataRenderComponent } from '@/components/DataRenderComponent/DataRenderComponent';
import { CONSTANTS } from '@/constants/constants';
import { getCrosschainTransfer } from '@/utils/getCrosschainTransfer';
import { objectToDataRenderComponentFields } from '@/utils/objectToDataRenderComponentFields';
import { Grid, Link, Stack, Text } from '@kadena/kode-ui';
import React, { useEffect } from 'react';
import { ifNill } from '../../utils/ifNill';

type TransactionResult = Exclude<
  TransactionRequestKeyQuery['transaction'],
  undefined | null
>['result'];

export const TransactionResultComponent: React.FC<{
  requestKey?: string;
  transaction?: TransactionResult | null;
  isLoading: boolean;
}> = ({ requestKey, transaction, isLoading }) => {
  const [crosschainTransfer, setCrosschainTransfer] =
    React.useState<Transfer>();

  useEffect(() => {
    if (transaction && transaction.__typename === 'TransactionResult') {
      const xchainTx = getCrosschainTransfer(transaction);
      setCrosschainTransfer(xchainTx);
    }
  }, [transaction]);

  if (transaction?.__typename !== 'TransactionResult') {
    return null;
  }

  if (!transaction) return;
  return (
    <>
      <DataRenderComponent
        isLoading={isLoading}
        title="Block"
        fields={[
          { key: 'Height', value: transaction.block.height },
          {
            key: 'Hash',
            value: transaction.block.hash,
            link: `/block/${transaction.block.hash}`,
          },
          { key: 'Created', value: transaction.block.creationTime },
        ]}
      />

      {transaction.__typename === 'TransactionResult' &&
        transaction.continuation &&
        JSON.parse(transaction.continuation ?? '{}').step === 0 &&
        !crosschainTransfer && (
          <DataRenderComponent
            isLoading={isLoading}
            title="Crosschain Transfer"
            fields={[
              {
                key: '',
                value: (
                  <Stack>
                    <Link
                      data-variant="primary"
                      target="_blank"
                      variant="primary"
                      href={`${CONSTANTS.CROSSCHAINTRACKER_URL}?reqKey=${requestKey}`}
                    >
                      Finish the transaction
                    </Link>
                  </Stack>
                ),
              },
            ]}
          />
        )}

      {transaction.__typename === 'TransactionResult' && crosschainTransfer && (
        <DataRenderComponent
          isLoading={isLoading}
          title="Crosschain Transfer"
          fields={[
            {
              key: 'Type',
              // note: this might be confusing
              //   where the COUNTERPART SENDER is empty, the COUNTERPART is
              //   the minting transaction (finisher transaction)
              // That makes the CURRENT transaction the sender
              value:
                getCrosschainTransfer(transaction).senderAccount.trim() === ''
                  ? 'Initiation transaction'
                  : 'Finisher transaction',
            },
            {
              key: 'Counterpart',
              value: getCrosschainTransfer(transaction).requestKey,
              link: `/transaction/${getCrosschainTransfer(transaction).requestKey}`,
            },
          ]}
        />
      )}

      <DataRenderComponent
        isLoading={isLoading}
        title="Result"
        fields={[
          {
            key: 'Result',
            value:
              transaction.badResult !== null
                ? `Failed: ${ifNill(transaction.badResult, '')}`
                : `Success: ${ifNill(transaction.goodResult, '')}`,
          },
          { key: 'Logs', value: transaction.logs },
          { key: 'Gas', value: transaction.gas },
          { key: 'Transaction ID', value: transaction.transactionId },
          {
            key: 'Continuation',
            value: transaction.continuation && (
              <DataRenderComponent
                fields={objectToDataRenderComponentFields({
                  ...JSON.parse(transaction.continuation ?? '{}'),
                })}
              />
            ),
          },
          { key: 'Metadata', value: transaction.metadata },
        ]}
      />

      <DataRenderComponent
        isLoading={isLoading}
        title="Events"
        fields={
          transaction.events.edges
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
      <Grid>
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
      </Grid>
    );
  } catch {
    return parameters;
  }
}
