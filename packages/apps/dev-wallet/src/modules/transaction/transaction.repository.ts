import { ILocalCommandResult } from '@kadena/chainweb-node-client';
import { ChainId, ICommandResult } from '@kadena/client';
import { IDBService, dbService } from '../db/db.service';
import { UUID } from '../types';

type NotSubmittedTransactionStatus = 'initiated' | 'signed' | 'preflight';
type SubmittedTransactionStatus =
  | 'submitted'
  | 'success'
  | 'failure'
  | 'persisted';

export type TransactionStatus =
  | NotSubmittedTransactionStatus
  | SubmittedTransactionStatus;

export type ITransaction = {
  uuid: string;
  networkUUID: UUID;
  profileId: string;
  hash: string;
  cmd: string;
  sigs: Array<
    | { sig?: string; pubKey: string }
    | { sig: string; pubKey?: string }
    | undefined
  >;
  groupId?: string;
  blockedBy?: string;
  continuation?: {
    autoContinue: boolean;
    crossChainId?: ChainId;
    proof?: string | null;
    continuationTxId?: string;
    tx?: ITransaction;
    done?: boolean;
  };
  purpose?: { type: string; data: Record<string, unknown> };
  result?: ICommandResult;
} & (
  | {
      height?: number;
      status: SubmittedTransactionStatus;
      request: {
        networkId: string;
        chainId: ChainId;
        requestKey: string;
      };
      result?: ICommandResult;
      preflight: ILocalCommandResult;
    }
  | {
      status: 'initiated' | 'signed';
      preflight?: undefined;
      request?: undefined;
    }
  | {
      status: 'preflight';
      preflight: ILocalCommandResult;
      request?: undefined;
    }
);

export interface TransactionRepository {
  getTransactionList: (
    profileId: string,
    networkUUID?: UUID,
    status?: TransactionStatus,
  ) => Promise<ITransaction[]>;
  getTransaction: (uuid: string) => Promise<ITransaction>;
  getTransactionByHash: (hash: string) => Promise<ITransaction>;
  getTransactionsByGroup: (
    groupId: string,
    profileId: string,
  ) => Promise<ITransaction[]>;
  getTransactionByHashNetworkProfile: (
    profileId: string,
    networkUUID: UUID,
    hash: string,
  ) => Promise<ITransaction>;
  addTransaction: (transaction: ITransaction) => Promise<void>;
  updateTransaction: (transaction: ITransaction) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
}

const createTransactionRepository = ({
  getAll,
  getOne,
  add,
  update,
  remove,
}: IDBService): TransactionRepository => {
  return {
    getTransactionList: async (
      profileId: string,
      networkUUID?: UUID,
      status?: TransactionStatus,
    ): Promise<ITransaction[]> => {
      if (status) {
        return getAll(
          'transaction',
          IDBKeyRange.only([profileId, networkUUID, status]),
          'network-status',
        );
      }
      if (networkUUID) {
        return getAll(
          'transaction',
          IDBKeyRange.only([profileId, networkUUID]),
          'network',
        );
      }
      return getAll('transaction', profileId, 'profileId');
    },
    getTransaction: async (uuid: string): Promise<ITransaction> => {
      return getOne('transaction', uuid);
    },
    getTransactionByHash: async (hash: string): Promise<ITransaction> => {
      const tx = getAll('transaction', hash, 'hash');
      return Array.isArray(tx) ? tx[0] : undefined;
    },
    getTransactionByHashNetworkProfile: async (
      profileId: string,
      networkUUID: UUID,
      hash: string,
    ) => {
      const txs = (await getAll(
        'transaction',
        IDBKeyRange.only([profileId, networkUUID, hash]),
        'unique-tx',
      )) as ITransaction[];
      if (txs.length > 1) {
        throw new Error('Multiple transactions with the same hash');
      }
      return txs[0];
    },
    getTransactionsByGroup: async (
      groupId: string,
      profileId: string,
    ): Promise<ITransaction[]> => {
      const txs: ITransaction[] = await getAll(
        'transaction',
        groupId,
        'groupId',
      );
      return txs.filter((tx) => tx.profileId === profileId);
    },
    addTransaction: async (transaction: ITransaction): Promise<void> => {
      console.log('addTransaction', transaction);
      await add('transaction', transaction);
    },
    updateTransaction: async (transaction: ITransaction): Promise<void> => {
      console.log('updateTransaction', transaction);
      await update('transaction', transaction);
    },
    deleteTransaction: async (transactionId: string): Promise<void> => {
      await remove('transaction', transactionId);
    },
  };
};
export const transactionRepository = createTransactionRepository(dbService);
