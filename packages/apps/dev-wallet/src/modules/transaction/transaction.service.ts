import {
  ChainId,
  createTransaction,
  IClient,
  ICommand,
  IUnsignedCommand,
} from '@kadena/client';
import {
  composePactCommand,
  continuation,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { UUID } from '../types';
import { ITransaction, transactionRepository } from './transaction.repository';

export async function addTransaction({
  transaction,
  profileId,
  networkUUID,
  groupId,
  autoContinue = false,
  crossChainId,
}: {
  transaction: IUnsignedCommand;
  profileId: string;
  networkUUID: UUID;
  groupId?: string;
  autoContinue?: boolean;
  crossChainId?: ChainId;
}) {
  const tx: ITransaction = {
    ...transaction,
    uuid: crypto.randomUUID(),
    profileId,
    networkUUID,
    status: 'initiated' as const,
    groupId,
    ...(crossChainId || autoContinue
      ? { continuation: { crossChainId, autoContinue } }
      : {}),
  };
  await transactionRepository.addTransaction(tx);
  return tx;
}

export const onSubmitTransaction = async (
  tx: ITransaction,
  client: IClient,
  onUpdate: (tx: ITransaction) => void,
) => {
  let updatedTx = await client
    .preflight({
      cmd: tx.cmd,
      sigs: tx.sigs,
      hash: tx.hash,
    } as ICommand)
    .then(async (result) => {
      console.log('preflight', result);
      const updatedTx = {
        ...tx,
        status: 'preflight',
        preflight: result,
        request: undefined,
      } as ITransaction;
      await transactionRepository.updateTransaction(updatedTx);
      return updatedTx;
    });
  onUpdate(updatedTx);
  if (
    'result' in updatedTx ||
    ('result' in updatedTx && updatedTx.result!.result.status === 'success')
  ) {
    return updatedTx;
  }
  if (updatedTx.preflight?.result.status === 'failure') {
    return updatedTx;
  }
  updatedTx = await client
    .submitOne({
      cmd: tx.cmd,
      sigs: tx.sigs,
      hash: tx.hash,
    } as ICommand)
    .then(async (request) => {
      updatedTx = {
        ...updatedTx,
        status: 'submitted',
        request,
      } as ITransaction;
      await transactionRepository.updateTransaction(updatedTx);
      return updatedTx;
    });
  onUpdate(updatedTx);

  updatedTx = await client.pollOne(updatedTx.request!).then(async (result) => {
    updatedTx = {
      ...updatedTx,
      status: result.result.status,
      result,
    } as ITransaction;
    await transactionRepository.updateTransaction(updatedTx);
    return updatedTx;
  });
  onUpdate(updatedTx);
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
      onUpdate(updatedTx);
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
      const contTx = await addTransaction({
        transaction: createTransaction(continuationTx),
        networkUUID: tx.networkUUID,
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
      onUpdate(updatedTx);
      await onSubmitTransaction(contTx, client, (tx) => {
        updatedTx = {
          ...updatedTx,
          continuation: {
            ...updatedTx.continuation!,
            tx,
          },
        };
        onUpdate(updatedTx);
      });
      updatedTx = {
        ...updatedTx,
        continuation: {
          ...updatedTx.continuation!,
          done: true,
        },
      };
      await transactionRepository.updateTransaction(updatedTx);
      onUpdate(updatedTx);
    }
  }
  return updatedTx;
};
