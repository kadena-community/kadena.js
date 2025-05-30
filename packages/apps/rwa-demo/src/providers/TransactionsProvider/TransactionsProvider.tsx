'use client';
import type {
  ITransaction,
  ITxType,
} from '@/contexts/TransactionsContext/TransactionsContext';
import {
  TransactionsContext,
  TXTYPES,
} from '@/contexts/TransactionsContext/TransactionsContext';
import { useAccount } from '@/hooks/account';
import { useAsset } from '@/hooks/asset';
import { useNetwork } from '@/hooks/networks';
import { useOrganisation } from '@/hooks/organisation';
import { transactionsQuery } from '@/services/graph/transactionSubscription.graph';
import { analyticsEvent } from '@/utils/analytics';
import { interpretMessage } from '@/utils/interpretMessage';
import { RWAStore } from '@/utils/store';
import { useApolloClient } from '@apollo/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { IWalletAccount } from '../AccountProvider/AccountType';

export const interpretErrorMessage = (
  result: any,
  data?: ITransaction,
): string => {
  if (typeof result === 'string') {
    return interpretMessage(result);
  }

  return interpretMessage(result?.result?.error?.message!, data);
};

export const TransactionsProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useApolloClient();
  const { organisation } = useOrganisation();
  const { asset } = useAsset();
  const { addNotification } = useNotifications();
  const { account } = useAccount();
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [txsAnimationRef, setTxsAnimationRefData] =
    useState<HTMLDivElement | null>(null);
  const [txsButtonRef, setTxsButtonRefData] =
    useState<HTMLButtonElement | null>(null);
  const { activeNetwork } = useNetwork();

  const store = useMemo(() => {
    if (!organisation) return;
    return RWAStore(organisation);
  }, [organisation]);

  const addListener = useCallback(
    (data: ITransaction, account: IWalletAccount) => {
      const r = client.subscribe({
        query: transactionsQuery,
        variables: { requestKey: data.requestKey },
      });

      r.subscribe(
        (nextData: any) => {
          if (
            nextData?.errors?.length !== undefined ||
            nextData?.data?.transaction?.result.badResult
          ) {
            analyticsEvent(`error:${data.type.name}`, {
              name: data.type.name,
              chainId: data?.chainId ?? '',
              networkId: data?.networkId ?? '',
              requestKey: data?.requestKey ?? '',
              message: JSON.stringify(
                nextData?.data.transaction?.result.badResult,
              ),
            });
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
              url: `https://explorer.kadena.io/${activeNetwork.name}/transaction/${data.requestKey}`,
            });
            return;
          }
        },
        (errorData) => {
          analyticsEvent(`error:${data.type.name}`, {
            name: data.type.name,
            chainId: data?.chainId ?? '',
            networkId: data?.networkId ?? '',
            requestKey: data?.requestKey ?? '',
            message: JSON.stringify(errorData),
          });

          addNotification({
            intent: 'negative',
            label: 'there was an error',
            message: JSON.stringify(errorData),
            url: `https://explorer.kadena.io/${activeNetwork.name}/transaction/${data.requestKey}`,
          });
        },
        () => {
          analyticsEvent(data.type.name, {
            chainId: data?.chainId ?? '',
            networkId: data?.networkId ?? '',
            requestKey: data?.requestKey ?? '',
            message: data?.result?.status,
          });
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          store?.removeTransaction(data, asset);
        },
      );

      return r;
    },
    [store, asset],
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

    await store?.addTransaction(data, asset);

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

  useEffect(() => {
    if (!account || !asset) return;
    const unlisten = store?.listenToTransactions(listenToTransactions, asset);
    return unlisten;
  }, [account, asset]);

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
