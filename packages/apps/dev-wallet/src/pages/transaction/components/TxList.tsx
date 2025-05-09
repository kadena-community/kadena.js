import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { Button, Stack, Text } from '@kadena/kode-ui';

import { Confirmation } from '@/Components/Confirmation/Confirmation';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IStepKeys } from '@/pages/transfer/transfer';
import { normalizeSigs } from '@/utils/normalizeSigs';
import { usePatchedNavigate } from '@/utils/usePatchedNavigate';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { MonoClose, MonoSignature } from '@kadena/kode-icons/system';
import { FocussedLayoutHeaderAside } from '@kadena/kode-ui/patterns';
import { isSignedCommand } from '@kadena/pactjs';
import React, { useCallback, useEffect } from 'react';
import { TxContainer } from './TxContainer';
import { statusPassed, steps } from './TxPipeLine/utils';

export const TxList = React.memo(
  ({
    txIds,
    sendDisabled,
    onDone,
    showExpanded,
    onSign,
    setStep,
  }: {
    txIds: string[];
    showExpanded?: boolean;
    sendDisabled?: boolean;
    onDone?: () => void;
    onSign?: (tx: ICommand) => void;
    setStep?: (step: IStepKeys) => void;
  }) => {
    const { sign, client, getPublicKeyData } = useWallet();
    const [transactions, setTransactions] = React.useState<ITransaction[]>([]);
    const [unSubmittedTxs, setUnSubmittedTxs] = React.useState(0);
    const navigate = usePatchedNavigate();

    useEffect(() => {
      if (!txIds || txIds.length === 0) {
        setTransactions([]);
        return;
      }
      Promise.all(txIds.map(transactionRepository.getTransaction)).then(
        setTransactions,
      );
    }, [txIds]);

    const countUnSubmittedTransactions = (
      transactions: ITransaction[],
    ): number => {
      return transactions.reduce((acc, tx) => {
        if (!statusPassed(tx.status, 'submitted')) acc++;
        return acc;
      }, 0);
    };

    useEffect(() => {
      if (!transactions) return;
      setUnSubmittedTxs(countUnSubmittedTransactions(transactions));
    }, [transactions]);

    const updateTx = useCallback(
      (updatedTx: ITransaction) =>
        setTransactions((prev) => {
          if (setStep) {
            console.log({ status: updatedTx?.status });
            switch (updatedTx?.status) {
              case 'initiated':
                setStep('sign');
                break;
              case 'signed':
                setStep('preflight');
                break;
              case 'preflight':
                setStep('send');
                break;
              case 'submitted':
                setStep('mining');
                break;
              case 'success':
              case 'failure':
                setStep('completed');
            }
          }
          if (updatedTx.status === 'signed' && onSign) {
            if (
              prev.find((tx) => tx.uuid === updatedTx.uuid)?.status !== 'signed'
            ) {
              onSign({
                cmd: updatedTx.cmd,
                hash: updatedTx.hash,
                sigs: updatedTx.sigs as ICommand['sigs'],
              });
            }
          }
          return prev.map((prevTx) =>
            prevTx.uuid === updatedTx.uuid ? updatedTx : prevTx,
          );
        }),
      [],
    );

    const signAll = async () => {
      const txs = await Promise.all(
        txIds.map(transactionRepository.getTransaction),
      );
      const signed = (await sign(txs)) as (IUnsignedCommand | ICommand)[];

      const updatedTxs = txs.map((tx) => {
        const signedTx = signed.find(({ hash }) => hash === tx.hash);
        if (!signedTx) return tx;
        const updatedTx = {
          ...tx,
          ...signedTx,
          status: isSignedCommand(signedTx)
            ? steps.indexOf(tx.status) < steps.indexOf('signed')
              ? 'signed'
              : tx.status
            : tx.status,
        } as ITransaction;
        if (updatedTx.status === 'signed' && onSign) {
          onSign({
            cmd: updatedTx.cmd,
            hash: updatedTx.hash,
            sigs: updatedTx.sigs as ICommand['sigs'],
          });
        }
        return updatedTx;
      });
      await updatedTxs.map(transactionRepository.updateTransaction);
      setTransactions(updatedTxs);
    };

    const onSendAll = async () => {
      const onSubmit = async (tx: ITransaction) => {
        return transactionService.submitTransaction(tx, client, updateTx);
      };

      const txs = await Promise.all(
        txIds.map(transactionRepository.getTransaction),
      );
      await Promise.all(txs.map(onSubmit));
      if (onDone) {
        onDone();
      }
    };

    const onPreflightAll = async () => {
      const onPreflight = async (tx: ITransaction) => {
        return transactionService.preflightTransaction(tx, client);
      };

      const txs = await Promise.all(
        txIds.map(transactionRepository.getTransaction),
      );
      const result = await Promise.all(txs.map(onPreflight));
      result.forEach(updateTx);
    };

    const signedByYou = (tx: ITransaction) => {
      const signers = normalizeSigs(tx);
      return !signers.find(
        (sigData) => !sigData?.sig && getPublicKeyData(sigData?.pubKey),
      );
    };

    return (
      <>
        <FocussedLayoutHeaderAside>
          {unSubmittedTxs === 0 ? (
            <Button
              isCompact
              variant="transparent"
              startVisual={<MonoClose />}
              onPress={() => {
                navigate('/');
              }}
            >
              Go Back
            </Button>
          ) : (
            <Confirmation
              label="Abort"
              onPress={() => {
                transactions.forEach((tx) => {
                  if (tx.uuid) {
                    transactionRepository.deleteTransaction(tx?.uuid);
                  }
                });

                navigate('/');
              }}
              trigger={
                <Button
                  isCompact
                  isDisabled={
                    !transactions[0] ||
                    statusPassed(transactions[0].status, 'submitted')
                  }
                  variant="transparent"
                  startVisual={<MonoClose />}
                >
                  {transactions.length > 1
                    ? `Abort ${unSubmittedTxs} transactions`
                    : 'Abort'}
                </Button>
              }
            >
              {transactions.length > 1
                ? 'Are you sure you want to abort these transactions?'
                : 'Are you sure you want to abort this transaction?'}
            </Confirmation>
          )}
        </FocussedLayoutHeaderAside>
        <Stack flexDirection={'column'} gap={'lg'}>
          <Stack flexDirection={'row'} flexWrap="wrap" gap="md">
            {transactions.length === 0 && <Text>No transactions</Text>}
            {!showExpanded &&
              transactions.map((tx) => (
                <TxContainer
                  key={tx.uuid}
                  as="tile"
                  transaction={tx}
                  sendDisabled={sendDisabled}
                  onUpdate={updateTx}
                />
              ))}
            {showExpanded &&
              transactions.map((tx) => (
                <Stack
                  key={tx.uuid}
                  flexDirection={'column'}
                  justifyContent={'flex-start'}
                  flex={1}
                  style={{ maxWidth: '100%' }}
                >
                  <TxContainer
                    key={tx.uuid}
                    as="expanded"
                    transaction={tx}
                    sendDisabled={sendDisabled}
                    onUpdate={updateTx}
                  />
                </Stack>
              ))}
          </Stack>
          {!showExpanded && !transactions.every((tx) => signedByYou(tx)) && (
            <Stack gap={'sm'} flexDirection={'column'}>
              <Text>You can sign all transactions at once.</Text>
              <Stack>
                <Button isCompact onClick={signAll}>
                  <Stack>
                    <MonoSignature scale={0.5} />
                    Sign All Transactions
                  </Stack>
                </Button>
              </Stack>
            </Stack>
          )}
          {!showExpanded &&
            transactions.every((tx) => signedByYou(tx)) &&
            !transactions.every((tx) => statusPassed(tx.status, 'signed')) && (
              <Stack gap={'sm'} flexDirection={'column'}>
                <Text>
                  There is no action at the moment; share the transactions with
                  other signers to sign
                </Text>
              </Stack>
            )}
          {!showExpanded &&
            !sendDisabled &&
            transactions.every((tx) => statusPassed(tx.status, 'signed')) &&
            transactions.find((tx) => tx.status === 'signed') && (
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>
                  All transactions are signed. Now you can call preflight
                </Text>
                <Stack>
                  <Button isCompact onPress={() => onPreflightAll()}>
                    Preflight transactions
                  </Button>
                </Stack>
              </Stack>
            )}
          {!showExpanded &&
            !sendDisabled &&
            transactions.every((tx) => statusPassed(tx.status, 'preflight')) &&
            transactions.find((tx) => tx.status === 'preflight') && (
              <Stack flexDirection={'column'} gap={'sm'}>
                <Text>
                  All transactions are signed. Now you can send them to the
                  blockchain
                </Text>
                <Stack>
                  <Button isCompact onPress={() => onSendAll()}>
                    Send transactions
                  </Button>
                </Stack>
              </Stack>
            )}
        </Stack>
      </>
    );
  },
  (prev, next) => {
    if (prev.sendDisabled !== next.sendDisabled) return false;
    if (prev.showExpanded !== next.showExpanded) return false;
    if (prev.txIds.length !== next.txIds.length) return false;
    return prev.txIds.every((txId, index) => txId === next.txIds[index]);
  },
);
