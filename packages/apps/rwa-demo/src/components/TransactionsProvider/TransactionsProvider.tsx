'use client';
import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
import type { ICommandResult } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from './utils';

export interface ITransaction {
  uuid: string;
  requestKey: string;
  type: string;
  listener?: Promise<void | ICommandResult>;
}

export interface ITransactionsContext {
  transactions: ITransaction[];
  addTransaction: (
    request: Omit<ITransaction, 'uuid'>,
  ) => Promise<ITransaction>;
  getTransactions: (type: string) => ITransaction[];
}

export const TransactionsContext = createContext<ITransactionsContext>({
  transactions: [],
  addTransaction: async (request) => {
    return {} as ITransaction;
  },
  getTransactions: () => [],
});

const interpretMessage = (str: string, data?: ITransaction): string => {
  if (str?.includes('Insert: row found for key')) {
    return `${data?.type}: This key already exists`;
  }
  if (str?.includes('buy gas failed')) {
    return `This account does not have enough balance to pay for Gas`;
  }

  return `${data?.type}: ${str}`;
};

export const interpretErrorMessage = (
  result: any,
  data?: ITransaction,
): string => {
  if (typeof result === 'string') {
    return interpretMessage(result);
  }

  return interpretMessage(result.result.error?.message!, data);
};

export const TransactionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotifications();
  const { account } = useAccount();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  const { activeNetwork } = useNetwork();

  const addListener = useCallback(
    (data: ITransaction, account: IWalletAccount) => {
      return getClient()
        .listen({
          requestKey: data.requestKey,
          chainId: activeNetwork.chainId,
          networkId: activeNetwork.networkId,
        })
        .then((result) => {
          if (result.result.status === 'failure') {
            addNotification({
              intent: 'negative',
              label: 'there was an error',
              message: interpretErrorMessage(result, data),
              url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
            });
          }
        })
        .catch((e) => {
          addNotification({
            intent: 'negative',
            label: 'there was an error',
            message: JSON.stringify(e),
            url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
          });
        })
        .finally(() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          store.removeTransaction(account!, data);
        });
    },
    [],
  );

  const getTransactions = (type: string) => {
    return Object.entries(transactions)
      .map(([key, val]) => val)
      .filter((val) => val.type === type);
  };

  const addTransaction = async (
    request: Omit<ITransaction, 'uuid'>,
  ): Promise<ITransaction> => {
    const foundExistingTransaction = transactions.find(
      (v) => v.requestKey === request.requestKey,
    );
    if (foundExistingTransaction) {
      console.error('requestKey already exists', request.requestKey);
      return foundExistingTransaction;
    }

    const data = { ...request, uuid: crypto.randomUUID() };
    data.listener = addListener(data, account!);
    setTransactions((v) => {
      return [...v, data];
    });

    await store.addTransaction(account!, data);

    return data;
  };

  const listenToTransactions = (transactions: ITransaction[]) => {
    setTransactions(transactions);
  };

  const init = async () => {
    store.listenToAllTransactions(account!, listenToTransactions);
  };
  useEffect(() => {
    if (!account) return;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, [account]);

  useEffect(() => {
    if (!account && !transactions.find((v) => !v.listener)) return;

    setTransactions((v) => {
      const transactionsWithListeners = v.map((transaction) => {
        const newTx = { ...transaction };
        if (newTx.listener) return newTx;
        newTx.listener = addListener(newTx, account!);

        return newTx;
      });

      return transactionsWithListeners;
    });
  }, [transactions.length, account]);

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, getTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
