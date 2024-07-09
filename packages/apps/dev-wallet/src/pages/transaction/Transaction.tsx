import {
  ITransaction,
  TransactionStatus,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { ICommand, createClient } from '@kadena/client';
import { Button, Heading, Notification, Stack, Text } from '@kadena/kode-ui';
import { isSignedCommand } from '@kadena/pactjs';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ReviewTransaction } from './components/ReviewTransaction';
import { SubmittedStatus } from './components/SubmittedStatus';

const steps: TransactionStatus[] = [
  'initiated',
  'signed',
  'submitted',
  'success',
  'failure',
  'persisted',
];

const getOverallStep = (list: ITransaction[]) =>
  list.reduce(
    (acc: [TransactionStatus, number], tx, idx) => {
      const [step] = acc;
      if (steps.indexOf(tx.status) < steps.indexOf(step)) {
        return [tx.status, idx] as [TransactionStatus, number];
      }
      return acc;
    },
    ['persisted', 0] as const,
  );

export function Transaction() {
  const { groupId } = useParams();
  const [Txs, setTxs] = useState<ITransaction[] | null>(null);
  const [step, setStep] = useState<TransactionStatus | null>(null);
  const [selectedTxIndex, setSelectedTxIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const loadTxs = useCallback(async (groupId: string) => {
    const list = await transactionRepository.getTransactionsByGroup(groupId);
    const [overallStep, firstTx] = getOverallStep(list);
    setTxs(list);
    setSelectedTxIndex(firstTx);
    setStep(overallStep);
    return list;
  }, []);

  useEffect(() => {
    if (groupId) {
      loadTxs(groupId);
    }
  }, [groupId, loadTxs]);

  const transaction = Txs ? Txs[selectedTxIndex] : null;

  const patchTransaction = useCallback(
    async (tx: Partial<ITransaction>) => {
      if (transaction && Txs) {
        const updated = {
          ...transaction,
          ...tx,
        } as ITransaction;
        await transactionRepository.updateTransaction(updated);
        const updatedList = Txs.map((t) =>
          t.uuid === updated.uuid ? updated : t,
        );
        const [overallStep, firstTx] = getOverallStep(updatedList);
        setTxs(updatedList);
        setSelectedTxIndex(firstTx);
        setStep(overallStep);
        return updatedList;
      }
    },
    [transaction, Txs],
  );

  const submitTxs = useCallback(async (list: ITransaction[]) => {
    if (!groupId) return;
    const client = createClient();
    if (!list.every(isSignedCommand)) return;
    const preflightValidation = await Promise.all(
      list.map((tx) =>
        client
          .preflight({ cmd: tx.cmd, sigs: tx.sigs, hash: tx.hash } as ICommand)
          .then(async (result) => {
            await transactionRepository.updateTransaction({
              ...tx,
              status: 'preflight',
              preflight: result,
              request: undefined,
            });
            return result.result.status === 'success';
          }),
      ),
    );
    if (preflightValidation.some((isValid) => !isValid)) {
      setError('Preflight failed');
      return;
    }
    await Promise.all(
      list.map((tx) =>
        client
          .submitOne({ cmd: tx.cmd, sigs: tx.sigs, hash: tx.hash } as ICommand)
          .then(async (request) => {
            const updatedTx = {
              ...tx,
              status: 'submitted',
              request,
            } as ITransaction;
            await transactionRepository.updateTransaction(updatedTx);
            await loadTxs(groupId);
            return request;
          })
          .then(async (req) => [await client.pollOne(req), req] as const)
          .then(async ([result, request]) => {
            const updatedTx = {
              ...tx,
              status: result.result.status,
              request,
              result,
            } as ITransaction;
            await transactionRepository.updateTransaction(updatedTx);
            await loadTxs(groupId);
            return result;
          })
          .catch((e) => {
            setError(e && e.message ? e.message : e ?? 'Unknown error');
          }),
      ),
    );
  }, []);

  if (!Txs || !transaction || !groupId) return null;

  if (['success', 'failure', 'submitted'].includes(step!)) {
    return (
      <Stack flexDirection={'column'} gap={'xl'}>
        <Heading variant="h4">{step}</Heading>
        <Stack gap={'lg'}>
          {Txs.map((tx) => (
            <SubmittedStatus key={tx.uuid} transaction={tx} />
          ))}
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Heading variant="h4">{step}</Heading>
      <Text>
        transaction {selectedTxIndex + 1}/{Txs.length}
      </Text>
      {error && <Notification role="alert">{error}</Notification>}
      <ReviewTransaction
        transaction={transaction}
        onSign={(sigs) => {
          patchTransaction({
            sigs,
            status: sigs.every((data) => data?.sig)
              ? steps.indexOf(transaction.status) < steps.indexOf('signed')
                ? 'signed'
                : transaction.status
              : transaction.status,
          });
        }}
      />
      <Stack gap={'sm'} flex={1}>
        <Button
          onClick={async () => {
            if (Txs.every(isSignedCommand)) {
              const list = await loadTxs(groupId);
              submitTxs(list);
            }
          }}
          isDisabled={!Txs.every(isSignedCommand)}
        >
          Submit
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
    </Stack>
  );
}
