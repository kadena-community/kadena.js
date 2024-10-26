import {
  ChainId,
  createTransaction,
  IClient,
  ICommand,
  IPactCommand,
  ITransactionDescriptor,
  IUnsignedCommand,
} from '@kadena/client';
import {
  composePactCommand,
  continuation,
  setMeta,
  setNetworkId,
} from '@kadena/client/fp';
import { isSignedCommand } from '@kadena/pactjs';
import { networkRepository } from '../network/network.repository';
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
    status: isSignedCommand(transaction) ? 'signed' : 'initiated',
    groupId,
    ...(crossChainId || autoContinue
      ? { continuation: { crossChainId, autoContinue } }
      : {}),
  };
  await transactionRepository.addTransaction(tx);
  return tx;
}

export async function syncTransactionStatus(
  tx: ITransaction,
  client: IClient,
): Promise<ITransaction> {
  if (tx.status === 'initiated') {
    return tx;
  }
  if (tx.status === 'failure') {
    return tx;
  }
  if (
    tx.status === 'success' &&
    (!tx.continuation?.autoContinue || tx.continuation?.done)
  ) {
    return tx;
  }
  if (tx.status === 'signed' || tx.status === 'preflight') {
    const network = await networkRepository.getNetwork(tx.networkUUID);
    if (!network) {
      throw new Error('Network not found');
    }
    const cmd: IPactCommand = JSON.parse(tx.cmd);
    const txDescriptor: ITransactionDescriptor = tx.request || {
      networkId: network.networkId,
      chainId: cmd.meta.chainId,
      requestKey: tx.hash,
    };
    const pollResponse = await client.getStatus(txDescriptor);
    const result = pollResponse[txDescriptor.requestKey];
    if (result) {
      const updatedTx: ITransaction = {
        ...tx,
        status: result.result.status,
        result: result,
        preflight: result,
        request: txDescriptor,
      };
      await transactionRepository.updateTransaction(updatedTx);
      return syncTransactionStatus(updatedTx, client);
    }
  }
  if (tx.status === 'submitted') {
    const result = await client.pollOne(tx.request!);
    if (result) {
      const updatedTx: ITransaction = {
        ...tx,
        status: result.result.status,
        result: result,
      };
      await transactionRepository.updateTransaction(updatedTx);
      return syncTransactionStatus(updatedTx, client);
    }
  }
  if (
    tx.status === 'success' &&
    tx.continuation?.autoContinue &&
    tx.result?.continuation?.pactId
  ) {
    if (tx.continuation.done) return tx;
    if (tx.continuation.tx) {
      return syncTransactionStatus(tx.continuation.tx, client).then(
        (contTx) =>
          ({
            ...tx,
            continuation: {
              ...tx.continuation,
              tx: contTx,
            },
          }) as ITransaction,
      );
    }
    if (tx.continuation.proof === undefined || tx.continuation.proof === null) {
      let updatedTx = {
        ...tx,
        continuation: { ...tx.continuation, proof: null as null | string },
      };
      await transactionRepository.updateTransaction(updatedTx);
      const proof = await client.pollCreateSpv(
        tx.request,
        tx.continuation.crossChainId || tx.request.chainId,
      );
      updatedTx = {
        ...updatedTx,
        continuation: { ...updatedTx.continuation, proof },
      };
      await transactionRepository.updateTransaction(updatedTx);
      return syncTransactionStatus(updatedTx, client);
    } else {
      // TODO: this is very specific to the crosschain-transfer. we should make it more generic
      const continuationTx = composePactCommand(
        continuation({
          pactId: tx.result?.continuation?.pactId,
          step: tx.result?.continuation!.step + 1,
          proof: tx.continuation.proof,
          rollback: false,
          data: {},
        }),
        setMeta({
          chainId: tx.continuation.crossChainId || tx.request.chainId,
          senderAccount: 'kadena-xchain-gas',
          gasLimit: 850,
        }),
        setNetworkId(tx.request.networkId),
      )();
      const contTx = await addTransaction({
        transaction: createTransaction(continuationTx),
        networkUUID: tx.networkUUID,
        profileId: tx.profileId,
        groupId: `${tx.groupId}:continuation`,
      });
      const updatedTx = {
        ...tx,
        continuation: {
          ...tx.continuation,
          continuationTxId: contTx.uuid,
        },
      };
      await transactionRepository.updateTransaction(updatedTx);
      await onSubmitTransaction(contTx, client);
      const txd = await transactionRepository.getTransaction(tx.uuid);
      const updatedTxd = {
        ...txd,
        continuation: { ...txd.continuation!, done: true },
      };
      await transactionRepository.updateTransaction(updatedTxd);
      return updatedTxd;
    }
  }
  return tx;
}

export const onSubmitTransaction = async (
  tx: ITransaction,
  client: IClient,
  onUpdate: (tx: ITransaction) => void = () => {},
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
          ...updatedTx.continuation!,
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
