import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { submitClient } from '@kadena/client-utils';
import { Button, Heading, Stack } from '@kadena/react-ui';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReviewTransaction } from './components/ReviewTransaction';
import { Signers } from './components/Signers';
import { SubmittedStatus } from './components/SubmittedStatus';
import { containerClass } from './components/style.css';

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
  const [error, setError] = useState<string | null>(null);
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

  const onError = (e: Error) => {
    console.error(e);
    setError(e.message ?? e.toString());
  };

  if (error) {
    return (
      <Stack flexDirection={'column'} gap={'xl'}>
        <Heading variant="h4">Error: {error}</Heading>
      </Stack>
    );
  }

  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Heading variant="h4">Status: {transaction?.status || 'UNKNOWN'}</Heading>
      {transaction?.status === 'initiated' && (
        <>
          <ReviewTransaction transaction={transaction} />
          <Stack gap={'sm'} flex={1}>
            <Button
              onClick={() => {
                task?.executeTo('sign').catch(onError);
              }}
            >
              Sign Transaction
            </Button>
            <Button
              variant="transparent"
              onClick={() => {
                transactionRepository.deleteTransaction(transaction.uuid);
              }}
            >
              Reject
            </Button>
          </Stack>
        </>
      )}

      {transaction?.status === 'signed' && (
        <Stack className={containerClass} flexDirection={'column'} gap={'lg'}>
          <Signers transaction={transaction} />
          <Stack gap={'sm'} justifyContent={'space-between'} flex={1}>
            <Stack gap={'sm'}>
              <Button
                variant="positive"
                onClick={() => {
                  const { cmd, hash, sigs } = transaction;
                  navigator.clipboard.writeText(
                    JSON.stringify({ cmd, hash, sigs }),
                  );
                }}
              >
                Copy Signed Transaction
              </Button>
              <Button
                variant="transparent"
                onClick={() => {
                  transactionRepository.deleteTransaction(transaction.uuid);
                }}
              >
                Remove Transaction
              </Button>
            </Stack>
            <Button
              onClick={() => {
                task?.execute().catch(onError);
              }}
            >
              Submit Transaction
            </Button>
          </Stack>
        </Stack>
      )}

      {transaction?.request && <SubmittedStatus transaction={transaction} />}
    </Stack>
  );
}
