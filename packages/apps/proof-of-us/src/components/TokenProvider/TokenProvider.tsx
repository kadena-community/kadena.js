'use client';
import { useAccount } from '@/hooks/account';
import { getClient } from '@/utils/client';
import { env } from '@/utils/env';

import { store } from '@/utils/socket/store';
import { differenceInMinutes, isPast } from 'date-fns';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface ITokenContext {
  tokens: IProofOfUsData[] | undefined;
  isLoading: boolean;
}

export const TokenContext = createContext<ITokenContext>({
  tokens: [],
  isLoading: false,
});

interface IListener {
  requestKey: string;
  proofOfUsId: string;
  listener: any;
  startDate: number;
}

const isDateOlderThan5Minutes = async (dateToCheck: Date): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const currentDate = new Date();
      const minutesDifference = differenceInMinutes(currentDate, dateToCheck);

      if (isPast(dateToCheck) && minutesDifference > 10) {
        resolve(true); // Date is older than 5 minutes
      } else {
        resolve(false); // Date is not older than 5 minutes
      }
    } catch (error) {
      reject(error);
    }
  });
};

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokens, setTokens] = useState<IProofOfUsData[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [listeners, setListeners] = useState<IListener[]>([]);
  const { account } = useAccount();

  useEffect(() => {
    if (Array.isArray(tokens)) {
      setIsLoading(false);
    }
  }, [tokens]);

  useEffect(() => {
    if (!account) return;
    setIsLoading(true);
    store.listenToUser(account, setTokens);
  }, [account]);

  useEffect(() => {
    if (!tokens) return;
    tokens.forEach(listenForMinting);
  }, [tokens]);

  const removeMintingToken = (listener: IListener) => {
    const filtered = listeners.filter(
      (l) => l.proofOfUsId !== listener.proofOfUsId,
    );
    setListeners(filtered);
  };

  const updateToken = async (
    tokenId: string,
    listener: IListener,
    mintStatus: 'error' | 'success',
  ) => {
    const token = tokens?.find((t) => t.proofOfUsId === listener.proofOfUsId);
    if (!token) return;

    const signees = token.signees.map((s) => ({
      ...s,
      signerStatus: 'success',
    })) as IProofOfUsSignee[];

    console.log('update in tokenprovider', signees);
    store.updateProofOfUs(
      { ...token, signees },
      {
        tokenId,
        mintStatus,
      },
    );
  };
  const listenAll = async () => {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];

      try {
        const promises = await Promise.all([
          isDateOlderThan5Minutes(new Date(listener.startDate)),
          listener.listener,
        ]);

        console.log(promises[1][listener.requestKey]);
        if (
          promises[1] &&
          promises[1][listener.requestKey] &&
          promises[1][listener.requestKey].result?.status === 'success'
        ) {
          updateToken(
            promises[1][listener.requestKey].result.data,
            listener,
            'success',
          );
        }
        if (
          promises[1] &&
          promises[1][listener.requestKey] &&
          promises[1][listener.requestKey].result?.status === 'failure'
        ) {
          updateToken(
            promises[1][listener.requestKey].result.data,
            listener,
            'error',
          );
        }
        if (promises[0]) {
          removeMintingToken(listener);
        }
      } catch (e) {
        console.error(e);
        updateToken('', listener, 'error');
        removeMintingToken(listener);
      }
    }
  };
  useEffect(() => {
    listenAll();
  }, [listeners]);

  async function listenForMinting(data: IProofOfUsData) {
    try {
      const isAlreadyListening = listeners.find(
        (listener) => listener.proofOfUsId === data.proofOfUsId,
      );
      if (isAlreadyListening || data.mintStatus === 'success') return;

      const listener = getClient().pollStatus({
        requestKey: data.requestKey,
        chainId: env.CHAINID,
        networkId: env.NETWORKID,
      });

      const obj = {
        proofOfUsId: data.proofOfUsId,
        requestKey: data.requestKey,
        listener,
        startDate: data.date,
      } as IListener;

      setListeners((v) => [...v, obj]);
    } catch (e) {
      console.error(data.requestKey, e);
    }
  }

  return (
    <TokenContext.Provider
      value={{
        tokens,
        isLoading,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
