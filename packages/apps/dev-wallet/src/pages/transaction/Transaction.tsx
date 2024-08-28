import {
  ITransaction,
  TransactionStatus,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { ICommand, IUnsignedCommand, createClient } from '@kadena/client';
import {
  MonoArrowBack,
  MonoArrowForward,
  MonoBrightness1,
} from '@kadena/kode-icons/system';
import { Box, Button, Card, Notification, Stack, Text } from '@kadena/kode-ui';
import { isSignedCommand } from '@kadena/pactjs';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ReviewTransaction } from './components/ReviewTransaction';
import { SubmittedStatus } from './components/SubmittedStatus';
import {
  failureClass,
  pendingClass,
  successClass,
  tabClass,
  tabTextClass,
} from './components/style.css';
import { tabStyle } from './style.css';

const steps: TransactionStatus[] = [
  'initiated',
  'signed',
  'preflight',
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
  const [viewStep, setViewStep] = useState<'transaction' | 'result'>('result');
  const navigate = useNavigate();
  const { sign } = useWallet();

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
        return loadTxs(groupId!);
      }
    },
    [transaction, Txs, groupId, loadTxs],
  );

  const submitTxs = useCallback(
    async (list: ITransaction[]) => {
      if (!groupId) return;
      const client = createClient();
      if (!list.every(isSignedCommand)) return;
      const preflightValidation = await Promise.all(
        list.map((tx) =>
          client
            .preflight({
              cmd: tx.cmd,
              sigs: tx.sigs,
              hash: tx.hash,
            } as ICommand)
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
      const listForSubmission = await loadTxs(groupId);
      await Promise.all(
        listForSubmission.map((tx) =>
          client
            .submitOne({
              cmd: tx.cmd,
              sigs: tx.sigs,
              hash: tx.hash,
            } as ICommand)
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
            .catch((e) => {
              setError(e && e.message ? e.message : e ?? 'Unknown error');
            }),
        ),
      );
    },
    [groupId, loadTxs],
  );

  useEffect(() => {
    async function run() {
      if (step === 'submitted' && groupId) {
        const client = createClient();
        const listForSubmission = await loadTxs(groupId);
        await Promise.all(
          listForSubmission.map((tx) =>
            tx.request
              ? client
                  .pollOne(tx.request)
                  .then(async (result) => {
                    const updatedTx = {
                      ...tx,
                      status: result.result.status,
                      result,
                    } as ITransaction;
                    await transactionRepository.updateTransaction(updatedTx);
                    await loadTxs(groupId);
                    return result;
                  })
                  .catch((e) => {
                    setError(e && e.message ? e.message : e ?? 'Unknown error');
                  })
              : null,
          ),
        );
      }
    }
    run();
  }, [step, groupId, loadTxs]);

  if (!Txs || !transaction || !groupId) return null;

  const resultStep = ['success', 'failure', 'submitted'].includes(step!);

  const Stepper = () => (
    <Stack gap={'lg'}>
      <button
        className={classNames(
          tabStyle,
          !resultStep || viewStep === 'transaction' ? 'selected' : '',
        )}
        onClick={() => {
          setViewStep('transaction');
        }}
      >
        Transaction
      </button>
      <button
        className={classNames(
          tabStyle,
          resultStep && viewStep === 'result' ? 'selected' : '',
        )}
        onClick={() => {
          setViewStep('result');
        }}
      >
        Result
      </button>
    </Stack>
  );

  if (
    ['success', 'failure', 'submitted'].includes(step!) &&
    viewStep === 'result'
  ) {
    return (
      <Stack flexDirection={'column'} gap={'xl'}>
        <Stepper />
        <Stack gap={'lg'} flexDirection={'column'}>
          <Stack gap={'sm'} flexWrap="wrap">
            {Txs.map((tx, index) => (
              <Button
                variant="transparent"
                key={tx.uuid}
                onClick={() => setSelectedTxIndex(index)}
                className={classNames(
                  tabClass,
                  selectedTxIndex === index && 'selected',
                )}
              >
                <Stack gap={'sm'}>
                  <Text className={tabTextClass}>{tx.hash}</Text>
                  <MonoBrightness1
                    className={classNames(
                      tx.status === 'success' && successClass,
                      tx.status === 'failure' && failureClass,
                      tx.status === 'submitted' && pendingClass,
                    )}
                  />
                </Stack>
              </Button>
            ))}
          </Stack>
          <SubmittedStatus transaction={transaction} />
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack flexDirection={'column'} gap={'xl'}>
      <Stepper />
      <Stack alignItems={'center'} justifyContent={'space-between'}>
        <Stack flexDirection={'row'} alignItems={'center'} gap={'sm'}>
          <Text>
            transaction {selectedTxIndex + 1}/{Txs.length}
          </Text>
          <BrowseTxs
            length={Txs.length}
            setSelectedTxIndex={setSelectedTxIndex}
          />
        </Stack>
        {!['success', 'failure', 'submitted'].includes(step!) && (
          <Button
            onClick={async () => {
              const signed = (await sign(Txs)) as (
                | IUnsignedCommand
                | ICommand
              )[];

              const updatedTxs = Txs.map((tx) => {
                const signedTx = signed.find(({ hash }) => hash === tx.hash);
                if (!signedTx) return tx;
                return {
                  ...tx,
                  ...signedTx,
                  status: isSignedCommand(signedTx)
                    ? steps.indexOf(tx.status) < steps.indexOf('signed')
                      ? 'signed'
                      : tx.status
                    : tx.status,
                } as ITransaction;
              });

              await updatedTxs.map(transactionRepository.updateTransaction);
              loadTxs(groupId!);
            }}
          >
            Sign All
          </Button>
        )}
      </Stack>
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
          isDisabled={
            !Txs.every(isSignedCommand) ||
            ['success', 'failure', 'submitted'].includes(step!)
          }
        >
          Submit
        </Button>
        <Button
          variant="transparent"
          onClick={() => {
            Txs.forEach((tx) => {
              transactionRepository.deleteTransaction(tx.uuid);
            });
            navigate(`/transactions`);
          }}
          isDisabled={['success', 'failure', 'submitted'].includes(step!)}
        >
          Reject
        </Button>
      </Stack>
    </Stack>
  );
}

function BrowseTxs({
  setSelectedTxIndex,
  length,
}: {
  setSelectedTxIndex: React.Dispatch<React.SetStateAction<number>>;
  length: number;
}) {
  return (
    length > 1 && (
      <Box>
        <Button
          variant="transparent"
          isCompact
          onClick={() => {
            setSelectedTxIndex((selectedTxIndex) =>
              selectedTxIndex === 0 ? selectedTxIndex : selectedTxIndex - 1,
            );
          }}
        >
          <MonoArrowBack />
        </Button>
        <Button
          variant="transparent"
          isCompact
          onClick={() => {
            setSelectedTxIndex((selectedTxIndex) =>
              selectedTxIndex === length - 1
                ? selectedTxIndex
                : selectedTxIndex + 1,
            );
          }}
        >
          <MonoArrowForward />
        </Button>
      </Box>
    )
  );
}
