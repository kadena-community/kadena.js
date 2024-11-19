'use client';
import { useNetwork } from '@/hooks/networks';
import { getClient } from '@/utils/client';
import type { ICommandResult } from '@kadena/client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useState } from 'react';

export interface ITransaction {
  requestKey: string;
  type: string;
  data: Record<string, string | number>;
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

export const TransactionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [transactions, setTransactions] = useState<
    Record<ITransaction['requestKey'], ITransaction>
  >({});

  const { activeNetwork } = useNetwork();

  const addListener = useCallback((requestKey: string) => {
    return getClient()
      .listen({
        requestKey,
        chainId: activeNetwork.chainId,
        networkId: activeNetwork.networkId,
      })
      .catch(console.log);
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
    data.listener = addListener(data.requestKey);
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
