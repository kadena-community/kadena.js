import {
  ITransaction,
  transactionRepository,
} from '@/modules/transaction/transaction.repository';

import { Button, Dialog, Stack, Text } from '@kadena/kode-ui';

import { useWallet } from '@/modules/wallet/wallet.hook';
import { ICommand, IUnsignedCommand, createTransaction } from '@kadena/client';
import {
  composePactCommand,
  continuation,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { MonoSignature } from '@kadena/kode-icons/system';
import { isSignedCommand } from '@kadena/pactjs';
import React from 'react';
import { TxTile, statusPassed, steps } from './TxTile';
import { containerClass } from './style.css';

import * as transactionService from '@/modules/transaction/transaction.service';
import { ExpandedTransaction } from './ExpandedTransaction';

export function TxList({
  txs,
  onUpdate,
  sendDisabled,
  onDone,
}: {
  txs: ITransaction[];
  onUpdate: () => void;
  sendDisabled?: boolean;
  onDone?: () => void;
}) {
  const [selectedTxIndex, setSelectedTxIndex] = React.useState<
    number | undefined
  >(undefined);
  const { sign, client } = useWallet();
  const signAll = async () => {
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
    onUpdate();
  };

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
    onUpdate();
  };

  const onSubmit = async (tx: ITransaction) => {
    let updatedTx = await client
      .preflight({
        cmd: tx.cmd,
        sigs: tx.sigs,
        hash: tx.hash,
      } as ICommand)
      .then(async (result) => {
        const updatedTx = {
          ...tx,
          status: 'preflight',
          preflight: result,
          request: undefined,
        } as ITransaction;
        await transactionRepository.updateTransaction(updatedTx);
        return updatedTx;
      });
    onUpdate();
    if (
      'result' in updatedTx ||
      ('result' in updatedTx && updatedTx.result!.result.status === 'success')
    ) {
      return updatedTx;
    }
    updatedTx = await client
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
        return updatedTx;
      });
    onUpdate();

    updatedTx = await client
      .pollOne(updatedTx.request!)
      .then(async (result) => {
        updatedTx = {
          ...updatedTx,
          status: result.result.status,
          result,
        } as ITransaction;
        await transactionRepository.updateTransaction(updatedTx);
        return updatedTx;
      });
    onUpdate();
    if (
      updatedTx.status === 'success' &&
      updatedTx.result?.continuation &&
      updatedTx.continuation &&
      updatedTx.continuation.autoContinue
    ) {
      if (updatedTx.continuation.proof === undefined) {
        const request = updatedTx.request;
        const crossChainId = updatedTx.continuation.crossChainId;
        const continuationData = updatedTx.continuation;
        const contResult = updatedTx.result;
        updatedTx = {
          ...updatedTx,
          continuation: {
            ...updatedTx.continuation,
            proof: null,
          },
        } as ITransaction;
        await transactionRepository.updateTransaction(updatedTx);
        onUpdate();
        let proof = null;
        if (crossChainId) {
          console.log('pollCreateSpv', request, crossChainId);
          proof = await client.pollCreateSpv(request, crossChainId);
          updatedTx = {
            ...updatedTx,
            continuation: {
              ...updatedTx.continuation,
              proof,
            },
          } as ITransaction;
          await transactionRepository.updateTransaction(updatedTx);
        }
        // TODO: this is very specific to the crosschain-transfer. we should make it more generic
        const continuationTx = composePactCommand(
          continuation({
            pactId: contResult.continuation!.pactId,
            step: contResult.continuation!.step + 1,
            proof,
            rollback: false,
            data: {},
          }),
          setMeta({
            chainId: crossChainId || request.chainId,
            senderAccount: 'kadena-xchain-gas',
            gasLimit: 850,
          }),
          setNetworkId(request.networkId),
        )();
        const contTx = await transactionService.addTransaction({
          transaction: createTransaction(continuationTx),
          networkId: request.networkId,
          profileId: updatedTx.profileId,
          groupId: `${updatedTx.groupId}:continuation`,
        });
        updatedTx = {
          ...updatedTx,
          continuation: {
            ...continuationData,
            continuationTxId: contTx.uuid,
          },
        };
        await transactionRepository.updateTransaction(updatedTx);
        // onUpdate();
        await onSubmit(contTx);
        updatedTx = {
          ...updatedTx,
          continuation: {
            ...updatedTx.continuation!,
            done: true,
          },
        };
        await transactionRepository.updateTransaction(updatedTx);
        onUpdate();
      }
    }
    return updatedTx;
  };

  const onSendAll = async () => {
    const result = await Promise.all(txs.map(onSubmit));
    if (onDone) {
      onDone();
    }
    console.log(result);
  };

  const selectedTx =
    selectedTxIndex !== undefined ? txs[selectedTxIndex] : undefined;
  return (
    <Stack flexDirection={'column'} gap={'lg'}>
      <Stack flexDirection={'row'} flexWrap="wrap" gap="md">
        {txs.length === 0 && <Text>No transactions</Text>}
        {txs.map((tx, index) => (
          <TxTile
            tx={tx}
            onView={() => setSelectedTxIndex(index)}
            onSubmit={() => onSubmit(tx)}
            onSign={() => onSign(tx)}
            sendDisabled={sendDisabled}
          />
        ))}
        <Dialog
          className={containerClass}
          isOpen={selectedTxIndex !== undefined}
          size="lg"
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setSelectedTxIndex(undefined);
            }
          }}
        >
          {selectedTx && (
            <ExpandedTransaction
              transaction={selectedTx}
              onSign={async (sigs) => {
                const updated = {
                  ...selectedTx,
                  sigs,
                  status: sigs.every((data) => data?.sig)
                    ? steps.indexOf(selectedTx.status) < steps.indexOf('signed')
                      ? 'signed'
                      : selectedTx.status
                    : selectedTx.status,
                } as ITransaction;
                await transactionRepository.updateTransaction(updated);
                onUpdate();
              }}
              onSubmit={() => onSubmit(selectedTx)}
            />
          )}
        </Dialog>
      </Stack>
      {!txs.every((tx) => statusPassed(tx.status, 'signed')) && (
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
      {!sendDisabled &&
        txs.every((tx) => statusPassed(tx.status, 'signed')) &&
        txs.find((tx) => tx.status === 'signed') && (
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
}
