'use client';
import { env } from '@/utils/env';
import { tryParse, decodeBase64, ERROR } from '@/utils/signWithSpireKey';
import { IUnsignedCommand, ICommand, createClient, isSignedTransaction, ITransactionDescriptor, IPollOptions, ICommandResult } from "@kadena/client"
import { useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

interface ITransactionError {
  message: string;
}

export interface ITransactionContext {
  transaction?: IUnsignedCommand | ICommand;
  error?: ITransactionError;
  preview: () => Promise<void | ICommandResult>
  send: () => Promise<void | ITransactionDescriptor>
  poll: (req: any) => Promise<any>;
  setTransaction: (transaction: IUnsignedCommand | ICommand) => void;
}

export const TransactionContext = createContext<ITransactionContext>({
  transaction: undefined,
  preview: async () => { },
  send: async () => { },
  poll: async (req) => { },
  setTransaction: (transaction) => { },
});

export const TransactionProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<IUnsignedCommand | ICommand>();
  const [isMounted, setIsMounted] = useState(false);

  const parseTx = (): void => {
    if (searchParams.has('transaction')) {
      const transactionSearch = searchParams.get('transaction');
      if (transactionSearch && transactionSearch?.length > 0) {
        const parsedTransaction = tryParse<IUnsignedCommand | ICommand>(
          decodeBase64(transactionSearch),
        );
        if (parsedTransaction === ERROR) {
          return;
        }
        console.log(
          'retrieved transaction from querystring parameters',
          JSON.stringify(parsedTransaction, null, 2),
        );
        console.log(parsedTransaction)
        setTransaction(parsedTransaction);
      }
    }
  }

  const { local, submitOne, pollStatus } = createClient(({ chainId, networkId }) => `${env.CHAINWEB_API_HOST}/chainweb/0.0/${networkId}/chain/${chainId}/pact`);


  const preview = async () => {
    if (!transaction) return;
    if (isSignedTransaction(transaction)) {
      const res = await local(transaction).catch(console.log);
      return res;
    }
  }

  const send = async () => {
    if (!transaction) return;
    const { meta } = JSON.parse(transaction?.cmd)
    if (isSignedTransaction(transaction)) {
      const res = await submitOne(transaction).catch(console.log);
      return res;
    }
  }

  const poll = async (req: any) => {
    return pollStatus(req);
  }

  useEffect(() => {
    parseTx();
  }, [searchParams]);

  return (
    <TransactionContext.Provider value={{ transaction, preview, send, poll, setTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
};
