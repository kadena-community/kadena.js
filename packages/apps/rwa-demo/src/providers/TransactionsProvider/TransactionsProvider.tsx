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
import { useNotifications } from '@/hooks/notifications';
import { useOrganisation } from '@/hooks/organisation';
import { transactionsQuery } from '@/services/graph/transactionSubscription.graph';
import { analyticsEvent } from '@/utils/analytics';
import { interpretMessage } from '@/utils/interpretMessage';
import { RWAStore } from '@/utils/store';
import { useApolloClient } from '@apollo/client';
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
  }, [organisation?.id]);

  const addListener = (
    data: ITransaction,
    account: IWalletAccount,
  ): { unsubscribe(): void; closed: boolean } => {
    const r = client.subscribe({
      query: transactionsQuery,
      variables: { requestKey: data.requestKey },
    });

    const showNotificationForAccount = data.accounts.some(
      (a) => a === account.address,
    );

    const subscription = r.subscribe(
      async (nextData: any) => {
        if (nextData?.data?.transaction?.result?.goodResult) {
          if (data.successMessage && showNotificationForAccount) {
            addNotification({
              intent: 'positive',
              label: 'transaction successful',
              message: data.successMessage,
            });
          }
          await store?.removeTransaction(data, asset);
        }
        if (
          nextData?.errors?.length !== undefined ||
          nextData?.data?.transaction?.result.badResult
        ) {
          const message = nextData?.errors
            ? JSON.stringify(nextData?.errors)
            : JSON.parse(nextData?.data.transaction?.result.badResult ?? '{}')
                .message;

          if (showNotificationForAccount) {
            addNotification(
              {
                intent: 'negative',
                label: message,
                message: interpretErrorMessage(message),
                url: `https://explorer.kadena.io/${activeNetwork.name}/transaction/${data.requestKey}`,
              },
              {
                name: `error:${data.type.name}`,
                options: {
                  requestKey: data?.requestKey ?? '',
                  message,
                  sentryData: {
                    label: new Error(message),
                    type: 'transaction-listener',
                    captureContext: {
                      extra: {
                        message: JSON.stringify(
                          nextData?.data.transaction?.result.badResult,
                        ),
                      },
                    },
                  },
                },
              },
            );
          }
          await store?.removeTransaction(data, asset);
          return;
        }
      },
      (errorData) => {
        if (showNotificationForAccount) {
          addNotification(
            {
              intent: 'negative',
              label: 'invalid transaction',
              message: JSON.stringify(errorData),
              url: `https://explorer.kadena.io/${activeNetwork.networkId}/transaction/${data.requestKey}`,
            },
            {
              name: `error:${data.type.name}`,
              options: {
                requestKey: data?.requestKey ?? '',
                sentryData: {
                  type: 'transaction-listener',
                },
              },
            },
          );
        }
      },
      async () => {
        if (showNotificationForAccount) {
          analyticsEvent(data.type.name, {
            chainId: data?.chainId ?? '',
            networkId: data?.networkId ?? '',
            requestKey: data?.requestKey ?? '',
            message: data?.result?.status,
          });
        }

        await store?.removeTransaction(data, asset);
      },
    );

    return subscription;
  };

  const getTransactions = useCallback(
    (type: ITxType | ITxType[]) => {
      if (!Array.isArray(type)) {
        return transactions.filter((val) => val.type.name === type.name);
      }
      return transactions.filter((val) =>
        type.find((t) => t.name === val.type.name),
      );
    },
    [transactions.length],
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
    await store?.addTransaction(data, asset);

    return data;
  };

  useEffect(() => {
    if (!account || !asset) return;

    const listenToTransactions = (transactionProps: ITransaction[]) => {
      const filteredTransactions = transactionProps.filter(
        (transaction) =>
          transaction.type.overall ||
          transaction.accounts.indexOf(account?.address!) >= 0,
      );

      setTransactions((v) => {
        //check if the tx already exists and has a listener.
        v.map((tx) => {
          tx?.listener?.unsubscribe?.();
        });
        return filteredTransactions;
      });
    };

    const unlisten = store?.listenToTransactions(listenToTransactions, asset);
    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [account?.address, asset?.uuid, store]);

  useEffect(() => {
    if (!account || !transactions.some((v) => !v.listener)) return;

    // Keep track of subscriptions to clean them up
    const subscriptions: { unsubscribe: () => void; closed: boolean }[] = [];

    transactions.map((transaction) => {
      transaction.listener = addListener(transaction, account);
      subscriptions.push(transaction.listener);
      return transaction;
    });

    // Cleanup subscriptions when the effect is re-run or unmounted
    return () => {
      subscriptions.forEach((subscription) => {
        if (subscription?.unsubscribe) {
          subscription.unsubscribe();
        }
      });
    };
  }, [transactions, account?.address]);

  // check if the account is an active account in one of the transactions
  // this is used to determine if the account change transaction is active
  // and should be displayed in the UI
  const isActiveAccountChangeTx: boolean = useMemo(() => {
    if (!account?.address) return false;
    const txs = getTransactions(TXTYPES.ADDAGENT);
    return !!txs.find((tx) => tx.accounts.indexOf(account.address) >= 0);
  }, [getTransactions, transactions, account?.address]);

  const setTxsButtonRef = (ref: HTMLButtonElement) => {
    setTxsButtonRefData(ref);
  };
  const setTxsAnimationRef = (ref: HTMLDivElement) => {
    setTxsAnimationRefData(ref);
  };

  const removeTransaction = async (data: ITransaction) => {
    await store?.removeTransaction(data, asset);
  };

  return (
    <TransactionsContext
      value={{
        transactions,
        addTransaction,
        getTransactions,
        setTxsButtonRef,
        txsButtonRef,
        setTxsAnimationRef,
        txsAnimationRef,
        isActiveAccountChangeTx,
        removeTransaction,
      }}
    >
      {children}
    </TransactionsContext>
  );
};
