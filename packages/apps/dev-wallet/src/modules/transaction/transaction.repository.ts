import { ILocalCommandResult } from '@kadena/chainweb-node-client';
import { ChainId, ICommandResult } from '@kadena/client';
import { IDBService, dbService } from '../db/db.service';

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
  networkId: string;
  profileId: string;
  hash: string;
  cmd: string;
  sigs: Array<
    | { sig?: string; pubKey: string }
    | { sig: string; pubKey?: string }
    | undefined
  >;
  groupId?: string;
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
    networkId: string,
    status?: TransactionStatus,
  ) => Promise<ITransaction[]>;
  getTransaction: (uuid: string) => Promise<ITransaction>;
  getTransactionByHash: (hash: string) => Promise<ITransaction>;
  getTransactionsByGroup: (groupId: string) => Promise<ITransaction[]>;
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
      networkId: string,
      status?: TransactionStatus,
    ): Promise<ITransaction[]> => {
      if (status) {
        return getAll(
          'transaction',
          IDBKeyRange.only([profileId, networkId, status]),
          'network-status',
        );
      }
      return getAll(
        'transaction',
        IDBKeyRange.only([profileId, networkId]),
        'network',
      );
    },
    getTransaction: async (uuid: string): Promise<ITransaction> => {
      return getOne('transaction', uuid);
    },
    getTransactionByHash: async (hash: string): Promise<ITransaction> => {
      const tx = getAll('transaction', hash, 'hash');
      return Array.isArray(tx) ? tx[0] : undefined;
    },
    getTransactionsByGroup: async (
      groupId: string,
    ): Promise<ITransaction[]> => {
      return getAll('transaction', groupId, 'groupId');
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
