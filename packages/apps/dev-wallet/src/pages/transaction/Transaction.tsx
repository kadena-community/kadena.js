import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { submitClient } from '@kadena/client-utils';
import { Heading, Stack } from '@kadena/react-ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReviewTransaction } from './components/ReviewTransaction';

const getTxStartPoint = (tx: ITransaction | undefined | null) => {
  if (!tx) {
    return null;
  }
  switch (tx.status) {
    case 'initiated':
      return [
        'command',
        { cmd: tx.cmd, hash: tx.hash, sigs: tx.sigs },
      ] as const;
    case 'signed':
      return ['sign', { cmd: tx.cmd, hash: tx.hash, sigs: tx.sigs }] as const;
    case 'submitted':
      return ['submit', tx.request] as const;
    case 'success':
      return ['listen', tx.result] as const;
    case 'failure':
      return ['listen', tx.result] as const;
    default:
      return null;
  }
};

export function Transaction() {
  const { transactionId } = useParams();
  const { sign } = useWallet();
  const [transaction, setTransaction] = useState<ITransaction | null>(null);
  const [task, setTask] = useState<ReturnType<
    ReturnType<typeof submitClient>['from']
  > | null>(null);

  const patchTransaction = async (tx: Partial<ITransaction>) => {
    setTransaction((transaction) => {
      const updated = {
        ...(transaction ?? {}),
        ...tx,
      } as ITransaction;
      transactionRepository.updateTransaction(updated);
      return updated;
    });
  };

  useEffect(() => {
    if (!transactionId) {
      return;
    }
    const run = async () => {
      const tx = await transactionRepository.getTransaction(transactionId);
      if (!tx) {
        throw new Error('Transaction not found');
      }
      setTransaction(tx);
      const startPoint = getTxStartPoint(tx);
      if (!startPoint) {
        throw new Error('Invalid transaction status');
      }
      const [event, data] = startPoint;
      console.log('startPoint', event, data);
      const process = submitClient({ sign }).from(event as any, data as any);
      process
        .on('command', async (data) => {
          patchTransaction({ ...data, status: 'initiated' });
        })
        .on('sign', async (data) => {
          patchTransaction({ ...data, status: 'signed' });
        })
        .on('submit', async (request) => {
          patchTransaction({ request, status: 'submitted' });
        })
        .on('listen', async (result) => {
          patchTransaction({
            result,
            status: result.result.status,
          });
        });
      setTask(process);
    };
    run();
  }, [transactionId, sign]);

  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Heading variant="h4">Status: {transaction?.status || 'UNKNOWN'}</Heading>
      {transaction?.status === 'initiated' && (
        <ReviewTransaction
          transaction={transaction}
          confirm={() => {
            console.log("task?.executeTo('sign')", task?.executeTo('sign'));
            task?.executeTo('sign');
          }}
          refuse={() => {
            transactionRepository.deleteTransaction(transaction.uuid);
          }}
        />
      )}

      {transaction?.status === 'signed' && (
        <Stack>
          <Heading variant="h4">Transaction Signed</Heading>
          {transaction.sigs.map((sig, i) => (
            <Stack key={i}>
              <Heading variant="h4">Signature {i + 1}</Heading>
              <Stack>
                <Heading variant="h5">PubKey</Heading>
                <Stack>{sig?.pubKey}</Stack>
              </Stack>
              <Stack>
                <Heading variant="h5">Signature</Heading>
                <Stack>{sig?.sig}</Stack>
              </Stack>
            </Stack>
          ))}
          <Stack>
            <button
              onClick={() => {
                task?.execute();
              }}
            >
              Submit
            </button>
          </Stack>
        </Stack>
      )}

      {transaction?.status === 'submitted' && (
        <Stack>
          <Heading variant="h4">Transaction Submitted</Heading>
          <Stack>
            <Heading variant="h5">Request</Heading>
            <Stack>{JSON.stringify(transaction.request)}</Stack>
          </Stack>
        </Stack>
      )}

      {transaction?.status === 'success' && (
        <Stack>
          <Heading variant="h4">Transaction Success</Heading>
          <Stack>
            <Heading variant="h5">Result</Heading>
            <Stack>{JSON.stringify(transaction.result)}</Stack>
          </Stack>
        </Stack>
      )}

      {transaction?.status === 'failure' && (
        <Stack>
          <Heading variant="h4">Transaction failed</Heading>
          <Stack>
            <Heading variant="h5">Result</Heading>
            <Stack>{JSON.stringify(transaction.result)}</Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}
