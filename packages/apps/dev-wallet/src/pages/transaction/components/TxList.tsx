import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { Button, Stack, Text } from '@kadena/kode-ui';

import { useWallet } from '@/modules/wallet/wallet.hook';
import { ICommand, IUnsignedCommand } from '@kadena/client';
import { MonoSignature } from '@kadena/kode-icons/system';
import { isSignedCommand } from '@kadena/pactjs';
import React, { useCallback, useEffect } from 'react';

import * as transactionService from '@/modules/transaction/transaction.service';
import { TxContainer } from './TxContainer';
import { statusPassed, steps } from './TxPipeLine';

export const TxList = React.memo(
  ({
    txIds,
    sendDisabled,
    onDone,
    showExpanded,
  }: {
    txIds: string[];
    showExpanded?: boolean;
    sendDisabled?: boolean;
    onDone?: () => void;
  }) => {
    const { sign, client } = useWallet();
    const [transactions, setTransactions] = React.useState<ITransaction[]>([]);

    useEffect(() => {
      if (!txIds || txIds.length === 0) {
        setTransactions([]);
        return;
      }
      Promise.all(txIds.map(transactionRepository.getTransaction)).then(
        setTransactions,
      );
    }, [txIds]);

    const updateTx = useCallback(
      (updatedTx: ITransaction) =>
        setTransactions((prev) =>
          prev.map((prevTx) =>
            prevTx.uuid === updatedTx.uuid ? updatedTx : prevTx,
          ),
        ),
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
      setTransactions(updatedTxs);
    };

    const onSendAll = async () => {
      const onSubmit = async (tx: ITransaction) => {
        return transactionService.submitTransaction(tx, client, updateTx);
      };

      const txs = await Promise.all(
        txIds.map(transactionRepository.getTransaction),
      );
      const result = await Promise.all(txs.map(onSubmit));
      if (onDone) {
        onDone();
      }
      console.log(result);
    };

    return (
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
              <Stack flexDirection={'column'} justifyContent={'flex-start'}>
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
        {!showExpanded &&
          !transactions.every((tx) => statusPassed(tx.status, 'signed')) && (
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
          !sendDisabled &&
          transactions.every((tx) => statusPassed(tx.status, 'signed')) &&
          transactions.find((tx) => tx.status === 'signed') && (
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
    );
  },
  (prev, next) => {
    if (prev.sendDisabled !== next.sendDisabled) return false;
    if (prev.showExpanded !== next.showExpanded) return false;
    if (prev.txIds.length !== next.txIds.length) return false;
    return prev.txIds.every((txId, index) => txId === next.txIds[index]);
  },
);
