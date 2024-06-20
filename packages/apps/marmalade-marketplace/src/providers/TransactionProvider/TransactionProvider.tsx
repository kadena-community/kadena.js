'use client';
import { env } from '@/utils/env';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { tryParse, decodeBase64 , ERROR} from '@/utils/signWithSpireKey';
import { IUnsignedCommand,ICommand, createClient, isSignedTransaction } from "@kadena/client"
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import { useAccount } from '@/hooks/account';

interface ITransactionError {
  message: string;
}

export interface ITransactionContext {
  transaction?: IUnsignedCommand | ICommand;
  error?: ITransactionError;
  preview: () => void,
  send: () => void,
}

export const TransactionContext = createContext<ITransactionContext>({
  transaction: undefined,
  preview: () => {},
  send: () => {},
});

export const TransactionProvider: FC<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const [transaction, setTransaction] = useState<IUnsignedCommand | ICommand>();
  const [isMounted, setIsMounted] = useState(false);
  console.log('parsing transaction', transaction)
  

  const parseTx =  (): void =>  {
    console.log("parseTx")
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

  const { local, submitOne } = createClient(({ chainId, networkId }) => `https://${env.CHAINWEB_API_HOST}/chainweb/0.0/${networkId}/chain/${chainId}/pact`);

    
  const preview = async () => {
    if (!transaction) return;
    if (isSignedTransaction(transaction)) {
      const res = await local(transaction).catch(console.log);
      return res;
    }
  }


  const send = async () => {
    if (!transaction) return;
    const {meta} = JSON.parse(transaction?.cmd)
    if (isSignedTransaction(transaction)) {
      const res = await submitOne(transaction).catch(console.log);
      return res;
    }
  }

  useEffect(() => {
    parseTx();
  }, [searchParams]);

  return (
    <TransactionContext.Provider value={{ transaction, preview, send }}>
      {children}
    </TransactionContext.Provider>
  );
};
