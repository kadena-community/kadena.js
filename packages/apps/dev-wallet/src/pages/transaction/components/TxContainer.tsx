import { useSubscribe } from '@/modules/db/useSubscribe';
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
    const [expandedModal, setExpandedModal] = useState(false);
    const { sign, client } = useWallet();
    const syncing = useRef(false);
    const doneRef = useRef(false);

    console.log(3333, { as, sendDisabled });

    const localTransaction = useSubscribe<ITransaction>(
      'transaction',
      transaction.uuid,
    );
    const contTx = useSubscribe<ITransaction>(
      'transaction',
      localTransaction?.continuation?.continuationTxId,
    );

    useEffect(() => {
      if (
        localTransaction &&
        localTransaction.status === 'success' &&
        (!localTransaction.continuation?.autoContinue ||
          contTx?.status === 'success')
      ) {
        if (onDone && !doneRef.current) {
          doneRef.current = true;
          console.log('onDone', localTransaction);
          onDone(localTransaction);
        }
      }
      if (localTransaction?.status === 'submitted' && onUpdate) {
        console.log('onUpdate', localTransaction);
        onUpdate(localTransaction);
      }
    }, [localTransaction?.status, contTx?.status]);

    useEffect(() => {
      if (!transaction) return;
      if (transaction && !syncing.current) {
        syncing.current = true;
        transactionService.syncTransactionStatus(transaction, client);
      }
    }, [transaction.uuid]);

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
        console.log({
          status: tx.status,
          d: steps.indexOf(tx.status),
          e: sigs.every((data) => data?.sig),
        });
        const updated = {
          ...tx,
          sigs,
          status: sigs.every((data) => data?.sig)
            ? steps.indexOf(tx.status) < steps.indexOf('signed')
              ? 'signed'
              : tx.status
            : 'initiated',
        } as ITransaction;
        await transactionRepository.updateTransaction(updated);
        // setLocalTransaction(updated);
        if (onUpdate) {
          onUpdate(updated);
        }
      };

    const onSubmit = useCallback(
      async (tx: ITransaction, skipPreflight = false) => {
        const result = await transactionService.submitTransaction(
          tx,
          client,
          undefined,
          skipPreflight,
        );
        if (onUpdate) onUpdate(result);

        return result;
      },
      [client, onUpdate],
    );

    const onPreflight = useCallback(
      async (tx: ITransaction) => {
        const result = await transactionService.preflightTransaction(
          tx,
          client,
        );
        if (onUpdate) onUpdate(result);

        return result;
      },
      [client, onUpdate],
    );

    if (!localTransaction) return null;
    const renderExpanded = (isDialog = false) => (
      <ExpandedTransaction
        transaction={localTransaction}
        contTx={contTx}
        onSign={onExpandedSign(localTransaction)}
        onSubmit={(skipPreflight = false) =>
          onSubmit(localTransaction, skipPreflight)
        }
        onPreflight={() => onPreflight(localTransaction)}
        sendDisabled={sendDisabled}
        showTitle={as === 'tile' || isDialog}
        isDialog={isDialog}
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
              {renderExpanded(true)}
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
              onPreflight={() => onPreflight(localTransaction)}
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
