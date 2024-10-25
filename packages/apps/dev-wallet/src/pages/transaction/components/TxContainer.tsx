import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';
import * as transactionService from '@/modules/transaction/transaction.service';
import { useWallet } from '@/modules/wallet/wallet.hook';
import { IUnsignedCommand } from '@kadena/client';
import { Dialog } from '@kadena/kode-ui';
import { isSignedCommand } from '@kadena/pactjs';
import React, { useEffect, useState } from 'react';
import { ExpandedTransaction } from './ExpandedTransaction';
import { containerClass } from './style.css';
import { steps } from './TxPipeLine';
import { TxTile } from './TxTile';

export const TxContainer = React.memo(
  ({
    transaction,
    as,
    sendDisabled,
    onUpdate,
  }: {
    transaction: ITransaction;
    as: 'tile' | 'expanded';
    sendDisabled?: boolean;
    onUpdate?: (tx: ITransaction) => void;
  }) => {
    const [localTransaction, setLocalTransaction] =
      useState<ITransaction | null>(null);
    const [expandedModal, setExpandedModal] = useState(false);
    const { sign, client } = useWallet();

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
      setLocalTransaction(updated);
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
        setLocalTransaction(updated);
        if (onUpdate) {
          onUpdate(updated);
        }
      };

    const onSubmit = async (tx: ITransaction) => {
      const result = await transactionService.onSubmitTransaction(
        tx,
        client,
        (updatedTx) => {
          setLocalTransaction(updatedTx);
        },
      );
      if (onUpdate) onUpdate(result);
      return result;
    };

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
    if (as === 'tile')
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
        </>
      );
    return renderExpanded();
  },
);
