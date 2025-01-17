'use client';
import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { useAccount } from '@/hooks/account';
import { useNetwork } from '@/hooks/networks';
import { transactionsQuery } from '@/services/graph/transactionSubscription.graph';
import { store } from '@/utils/store';
import { useApolloClient } from '@apollo/client';
import type { ICommandResult } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface ITxType {
  name: keyof typeof TXTYPES;
  overall?: boolean;
}

export const TXTYPES: Record<
  | 'SETCOMPLIANCE'
  | 'SETCOMPLIANCERULE'
  | 'ADDINVESTOR'
  | 'DELETEINVESTOR'
  | 'ADDAGENT'
  | 'REMOVEAGENT'
  | 'CREATECONTRACT'
  | 'FREEZEINVESTOR'
  | 'DISTRIBUTETOKENS'
  | 'PARTIALLYFREEZETOKENS'
  | 'TRANSFERTOKENS'
  | 'FAUCET'
  | 'PAUSECONTRACT',
  ITxType
> = {
  SETCOMPLIANCE: { name: 'SETCOMPLIANCE', overall: true },
  SETCOMPLIANCERULE: { name: 'SETCOMPLIANCERULE', overall: true },
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
  FAUCET: { name: 'FAUCET', overall: false },
} as const;

export interface ITransaction {
  uuid: string;
  requestKey: string;
  type: ITxType;
  listener?: any;
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
  isActiveAccountChangeTx: boolean; //checks if the agentroles for this user are being changed. if so, stop all permissions until the tx is resolved
}

export const TransactionsContext = createContext<ITransactionsContext>({
  transactions: [],
  addTransaction: async (request) => {
    return {} as ITransaction;
  },
  getTransactions: () => [],
  setTxsButtonRef: () => {},
  setTxsAnimationRef: () => {},
  isActiveAccountChangeTx: false,
});

const interpretMessage = (str: string, data?: ITransaction): string => {
  if (str?.includes('Insert: row found for key')) {
    return `${data?.type}: This key already exists`;
  }
  if (str?.includes('buy gas failed')) {
    return `This account does not have enough balance to pay for Gas`;
  }
  if (str?.includes('exceeds max investor')) {
    return `The maximum amount of investors has been reached`;
  }
  if (str?.includes('PactDuplicateTableError')) {
    return `This already exists`;
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
  const client = useApolloClient();
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
      const r = client.subscribe({
        query: transactionsQuery,
        variables: { requestKey: data.requestKey },
      });

      r.subscribe(
        (nextData: any) => {
          if (!nextData.data.transaction) {
            addNotification({
              intent: 'negative',
              label: 'there was an error',
              message: interpretErrorMessage(
                nextData?.errors
                  ? JSON.stringify(nextData?.errors)
                  : JSON.parse(
                      nextData?.data.transaction?.result?.badResult ?? '{}',
                    ).message,
              ),
              url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
            });

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            store.removeTransaction(data);
          }
          if (
            nextData?.errors?.length !== undefined ||
            nextData?.data?.transaction?.result.badResult
          ) {
            addNotification({
              intent: 'negative',
              label: 'there was an error',
              message: interpretErrorMessage(
                nextData?.errors
                  ? JSON.stringify(nextData?.errors)
                  : JSON.parse(
                      nextData?.data.transaction?.result.badResult ?? '{}',
                    ).message,
              ),
              url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
            });
            return;
          }
        },
        (errorData) => {
          addNotification({
            intent: 'negative',
            label: 'there was an error',
            message: JSON.stringify(errorData),
            url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
          });
        },
        () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          store.removeTransaction(data);
        },
      );

      return r;
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

  const isActiveAccountChangeTx: boolean = useMemo(() => {
    if (!account?.address) return false;
    const txs = getTransactions(TXTYPES.ADDAGENT);
    return !!txs.find((tx) => tx.accounts.indexOf(account.address) >= 0);
  }, [getTransactions(TXTYPES.ADDAGENT), account?.address]);

  const setTxsButtonRef = (ref: HTMLButtonElement) => {
    setTxsButtonRefData(ref);
  };
  const setTxsAnimationRef = (ref: HTMLDivElement) => {
    setTxsAnimationRefData(ref);
  };

  console.log({ transactions });

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
        isActiveAccountChangeTx,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
