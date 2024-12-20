'use client';
import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import { getClient } from '@/utils/client';
import { store } from '@/utils/store';
import type { ICommandResult } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface ITxType {
  name: keyof typeof TXTYPES;
  overall?: boolean;
}

export const TXTYPES: Record<
  | 'SETCOMPLIANCE'
  | 'ADDINVESTOR'
  | 'DELETEINVESTOR'
  | 'ADDAGENT'
  | 'REMOVEAGENT'
  | 'CREATECONTRACT'
  | 'FREEZEINVESTOR'
  | 'DISTRIBUTETOKENS'
  | 'PARTIALLYFREEZETOKENS'
  | 'TRANSFERTOKENS'
  | 'PAUSECONTRACT',
  ITxType
> = {
  SETCOMPLIANCE: { name: 'SETCOMPLIANCE', overall: true },
  ADDINVESTOR: { name: 'ADDINVESTOR', overall: true },
  DELETEINVESTOR: { name: 'DELETEINVESTOR', overall: true },
  ADDAGENT: { name: 'ADDAGENT', overall: true },
  REMOVEAGENT: { name: 'REMOVEAGENT', overall: true },
  PAUSECONTRACT: { name: 'PAUSECONTRACT', overall: true },
  FREEZEINVESTOR: { name: 'FREEZEINVESTOR', overall: true },
  CREATECONTRACT: { name: 'CREATECONTRACT', overall: true },
  DISTRIBUTETOKENS: { name: 'DISTRIBUTETOKENS', overall: true },
  PARTIALLYFREEZETOKENS: { name: 'PARTIALLYFREEZETOKENS', overall: true },
  TRANSFERTOKENS: { name: 'TRANSFERTOKENS', overall: true },
} as const;

export interface ITransaction {
  uuid: string;
  requestKey: string;
  type: ITxType;
  listener?: Promise<void | ICommandResult>;
  accounts: string[];
  result?: ICommandResult['result'];
}

export interface ITransactionsContext {
  transactions: ITransaction[];
  addTransaction: (
    request: Omit<ITransaction, 'uuid'>,
  ) => Promise<ITransaction>;
  getTransactions: (type: ITxType | ITxType[]) => ITransaction[];
  txsButtonRef?: HTMLButtonElement | null;
  setTxsButtonRef: (value: HTMLButtonElement) => void;
  txsAnimationRef?: HTMLDivElement | null;
  setTxsAnimationRef: (value: HTMLDivElement) => void;
}

export const TransactionsContext = createContext<ITransactionsContext>({
  transactions: [],
  addTransaction: async (request) => {
    return {} as ITransaction;
  },
  getTransactions: () => [],
  setTxsButtonRef: () => {},
  setTxsAnimationRef: () => {},
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
  const [txsAnimationRef, setTxsAnimationRefData] =
    useState<HTMLDivElement | null>(null);
  const [txsButtonRef, setTxsButtonRefData] =
    useState<HTMLButtonElement | null>(null);

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
          console.log(data);
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          store.removeTransaction(data);
        });
    },
    [],
  );

  const getTransactions = useCallback(
    (type: ITxType | ITxType[]) => {
      if (!Array.isArray(type)) {
        return transactions.filter((val) => val.type.name === type.name);
      }
      return transactions.filter((val) =>
        type.find((t) => t.name === val.type.name),
      );
    },
    [transactions],
  );

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

    await store.addTransaction(data);

    return data;
  };

  const listenToTransactions = (transactions: ITransaction[]) => {
    const filteredTransactions = transactions.filter(
      (transaction) =>
        transaction.type.overall ||
        transaction.accounts.indexOf(account?.address!) >= 0,
    );
    setTransactions(filteredTransactions);
  };

  const init = async () => {
    store.listenToTransactions(listenToTransactions);
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

  const setTxsButtonRef = (ref: HTMLButtonElement) => {
    setTxsButtonRefData(ref);
  };
  const setTxsAnimationRef = (ref: HTMLDivElement) => {
    setTxsAnimationRefData(ref);
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        addTransaction,
        getTransactions,
        setTxsButtonRef,
        txsButtonRef,
        setTxsAnimationRef,
        txsAnimationRef,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
