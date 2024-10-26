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
import React, { useCallback, useEffect, useState } from 'react';
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
    const [expandedModal, setExpandedModal] = useState(false);
    const { sign, client } = useWallet();

    useEffect(() => {
      if (transaction.uuid) return;
      transactionService.syncTransactionStatus(transaction, client);
    }, [transaction.uuid]);

    useEffect(() => {
      if (!transaction) return;
      dbService.subscribe((event, table, data) => {
        if (table !== 'transaction' || event !== 'update') return;
        if (data.uuid === transaction.uuid) {
          setLocalTransaction(data);
          return;
        }
        if (data.continuation?.continuationTxId === transaction.uuid) {
          setLocalTransaction({ ...data });
        }
      });
    }, [transaction.uuid, localTransaction?.continuation?.continuationTxId]);

    useEffect(() => {
      if (!transaction) return;
      transactionRepository
        .getTransaction(transaction.uuid)
        .then(setLocalTransaction);
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
