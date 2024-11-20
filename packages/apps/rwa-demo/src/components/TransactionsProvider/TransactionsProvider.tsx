'use client';
import { useNetwork } from '@/hooks/networks';
import { getClient } from '@/utils/client';
import type { ICommandResult } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useState } from 'react';

export interface ITransaction {
  requestKey: string;
  type: string;
  data: Record<string, any>;
  listener?: Promise<void | ICommandResult>;
  result?: boolean;
}

export interface ITransactionsContext {
  transactions: Record<ITransaction['requestKey'], ITransaction>;
  addTransaction: (request: ITransaction) => void;
  getTransactions: (type: string) => ITransaction[];
}

export const TransactionsContext = createContext<ITransactionsContext>({
  transactions: {},
  addTransaction: (request) => {},
  getTransactions: () => [],
});

const interpretErrorMessage = (result: any, data: ITransaction): string => {
  if (result.result.error?.message?.includes('Insert: row found for key')) {
    return `{data.type}: This key already exists`;
  }

  return `${data.type}: ${result.result.error.message}`;
};

export const TransactionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { addNotification } = useNotifications();
  const [transactions, setTransactions] = useState<
    Record<ITransaction['requestKey'], ITransaction>
  >({});

  const { activeNetwork } = useNetwork();

  const addListener = useCallback((data: ITransaction) => {
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
      });
  }, []);

  const getTransactions = (type: string) => {
    return Object.entries(transactions)
      .map(([key, val]) => val)
      .filter((val) => val.type === type);
  };

  const addTransaction = (request: ITransaction) => {
    if (transactions[request.requestKey]) {
      console.error('requestKey already exists', request.requestKey);
      return;
    }

    const data = { ...request };
    data.listener = addListener(data);
    setTransactions((v) => {
      return { ...v, [request.requestKey]: { ...data } };
    });
  };

  return (
    <TransactionsContext.Provider
      value={{ transactions, addTransaction, getTransactions }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
