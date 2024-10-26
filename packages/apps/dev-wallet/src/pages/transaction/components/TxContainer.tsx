import { dbService } from '@/modules/db/db.service';
import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IUnsignedCommand } from '@kadena/client';
import { Dialog } from '@kadena/kode-ui';
import { isSignedCommand } from '@kadena/pactjs';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ExpandedTransaction } from './ExpandedTransaction';
import { containerClass } from './style.css';
import { TxMinimized } from './TxMinimized';
import { steps } from './TxPipeLine';
import { TxTile } from './TxTile';

export const TxContainer = React.memo(
  ({
    transaction,
    as,
    sendDisabled,
    onUpdate,
    onDone,
  }: {
    transaction: ITransaction;
    as: 'tile' | 'expanded' | 'minimized';
    sendDisabled?: boolean;
    onUpdate?: (tx: ITransaction) => void;
    onDone?: (tx: ITransaction) => void;
  }) => {
    const [localTransaction, setLocalTransaction] =
      useState<ITransaction | null>(null);

    const [contTx, setContTx] = useState<ITransaction>();
    const [expandedModal, setExpandedModal] = useState(false);
    const { sign, client } = useWallet();
    const syncing = useRef(false);

    useEffect(() => {
      if (!transaction) return;
      const unsubscribe = dbService.subscribe((event, table, data) => {
        if (table !== 'transaction' || event !== 'update') return;
        if (data.uuid === transaction.uuid) {
          setLocalTransaction(data);
          console.log(
            'data.continuation?.continuationTxId',
            data.continuation?.continuationTxId,
            'contTx?.uuid',
            contTx?.uuid,
          );
          if (data.continuation?.continuationTxId && !contTx?.uuid) {
            console.log('fetching contTx');
            transactionRepository
              .getTransaction(data.continuation.continuationTxId)
              .then(setContTx);
          }
          return;
        }
        if (contTx?.uuid === data.uuid) {
          setContTx(data);
          return;
        }
      });
      if (!syncing.current) {
        syncing.current = true;
        transactionService.syncTransactionStatus(transaction, client);
      }
      return () => {
        unsubscribe();
      };
    }, [transaction.uuid, contTx?.uuid, transaction, client]);

    useEffect(() => {
      if (!transaction) return;
      const run = async () => {
        const tx = await transactionRepository.getTransaction(transaction.uuid);
        setLocalTransaction(tx);
        if (tx.continuation?.continuationTxId) {
          const cont = await transactionRepository.getTransaction(
            tx.continuation.continuationTxId,
          );
          setContTx(cont);
        }
      };
      run();
    }, [transaction]);

    const onSign = async (tx: ITransaction) => {
      const signed = (await sign(tx)) as IUnsignedCommand;
      const updated = {
        ...tx,
        ...signed,
        status: isSignedCommand(signed)
          ? steps.indexOf(tx.status) < steps.indexOf('signed')
            ? 'signed'
            : tx.status
          : tx.status,
      } as ITransaction;
      await transactionRepository.updateTransaction(updated);
      // setLocalTransaction(updated);
      if (onUpdate) {
        onUpdate(updated);
      }
    };

    const onExpandedSign =
      (tx: ITransaction) => async (sigs: ITransaction['sigs']) => {
        const updated = {
          ...tx,
          sigs,
          status: sigs.every((data) => data?.sig)
            ? steps.indexOf(tx.status) < steps.indexOf('signed')
              ? 'signed'
              : tx.status
            : tx.status,
        } as ITransaction;
        await transactionRepository.updateTransaction(updated);
        // setLocalTransaction(updated);
        if (onUpdate) {
          onUpdate(updated);
        }
      };

    const onSubmit = useCallback(
      async (tx: ITransaction) => {
        const result = await transactionService.onSubmitTransaction(
          tx,
          client,
          // (updatedTx) => {
          //   // setLocalTransaction(updatedTx);
          // },
        );
        if (onUpdate) onUpdate(result);
        if (onDone) onDone(result);
        return result;
      },
      [client, onDone, onUpdate],
    );

    if (!localTransaction) return null;
    const renderExpanded = () => (
      <ExpandedTransaction
        transaction={localTransaction}
        contTx={contTx}
        onSign={onExpandedSign(localTransaction)}
        onSubmit={() => onSubmit(localTransaction)}
        sendDisabled={sendDisabled}
        showTitle={as === 'tile'}
      />
    );
    if (as === 'tile' || as === 'minimized')
      return (
        <>
          {expandedModal && (
            <Dialog
              className={containerClass}
              isOpen={true}
              size="lg"
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setExpandedModal(false);
                }
              }}
            >
              {renderExpanded()}
            </Dialog>
          )}
          {as === 'tile' && (
            <TxTile
              tx={localTransaction}
              contTx={contTx}
              sendDisabled={sendDisabled}
              onSign={() => {
                onSign(localTransaction);
              }}
              onSubmit={() => onSubmit(localTransaction)}
              onView={async () => {
                setExpandedModal(true);
              }}
            />
          )}
          {as === 'minimized' && (
            <TxMinimized
              tx={localTransaction}
              contTx={contTx}
              sendDisabled={sendDisabled}
              onSign={() => {
                onSign(localTransaction);
              }}
              onSubmit={() => onSubmit(localTransaction)}
              onView={async () => {
                setExpandedModal(true);
              }}
            />
          )}
        </>
      );

    return renderExpanded();
  },
);
