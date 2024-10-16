import { ListItem } from '@/Components/ListItem/ListItem';
import { ITransaction } from '@/modules/transaction/transaction.repository';
import { shorten } from '@/utils/helpers';
import { ChainId } from '@kadena/client';
import { Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { statusPassed } from '../../transaction/components/TxTile';
import { TrG } from './TransferForm';

export function Result({
  redistribution,
  transfer,
}: {
  redistribution: TrG;
  transfer: TrG;
}) {
  const allSuccess = transfer.txs.every((tx) =>
    statusPassed(tx.status, 'success'),
  );
  const allFailed = transfer.txs.every((tx) => tx.status === 'failure');
  const partiallySuccess =
    transfer.txs.some((tx) => statusPassed(tx.status, 'success')) &&
    transfer.txs.some((tx) => tx.status === 'failure');

  const groupedTransfers = transfer.txs.reduce(
    (acc, tx) => {
      if (
        !tx.purpose?.data.receiver ||
        typeof tx.purpose?.data.receiver !== 'string'
      )
        return acc;
      acc[tx.purpose?.data.receiver] = acc[tx.purpose?.data.receiver] || [];
      acc[tx.purpose?.data.receiver].push(tx as any);
      return acc;
    },
    {} as Record<
      string,
      Array<
        ITransaction & {
          purpose: {
            type: 'transfer';
            data: {
              amount: string;
              totalAmount: string;
              chainId: ChainId;
              receiver: string;
            };
          };
        }
      >
    >,
  );
  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      {allSuccess && (
        <Notification role="status" intent="positive">
          All transactions are successful
        </Notification>
      )}
      {allFailed && (
        <Notification role="status" intent="negative">
          All transactions failed
        </Notification>
      )}
      {partiallySuccess && (
        <Notification role="status" intent="negative">
          Some transactions failed; please check the details
        </Notification>
      )}
      {redistribution.txs.length > 0 && (
        <Stack flexDirection={'column'}>
          <Heading>Redistribution</Heading>
          {redistribution.txs.map((tx) => {
            const data = tx.purpose?.data as {
              source: ChainId;
              target: ChainId;
              amount: string;
            };
            return (
              <ListItem>
                <Stack key={tx.uuid} gap={'lg'}>
                  <Text>tx: {shorten(tx.hash)}</Text>
                  <Text>{tx.continuation?.done ? 'success' : 'failure'}</Text>
                  <Text>Source: chain {data.source}</Text>
                  <Text>target: chain {data.target}</Text>
                  <Text>amount: {data.amount}</Text>
                </Stack>
              </ListItem>
            );
          })}
        </Stack>
      )}
      <Stack flexDirection={'column'}>
        <Heading>Transfers</Heading>
        {Object.entries(groupedTransfers).map(([receiver, tx]) => (
          <ListItem>
            <Stack key={receiver} flexDirection={'column'}>
              <Stack gap={'lg'}>
                <Text>Receiver: {shorten(receiver)}</Text>
                <Text>Total Amount: {tx[0].purpose.data.totalAmount}</Text>
              </Stack>
              {tx.map((t) => {
                return (
                  <ListItem>
                    <Stack gap="lg">
                      <Text>Tx: {shorten(t.hash)}</Text>
                      <Text>Chain: {t.purpose.data.chainId}</Text>
                      <Text>Amount: {t.purpose.data.amount}</Text>
                      <Text>{t.status}</Text>
                    </Stack>
                  </ListItem>
                );
              })}
            </Stack>
          </ListItem>
        ))}
      </Stack>
    </Stack>
  );
}
