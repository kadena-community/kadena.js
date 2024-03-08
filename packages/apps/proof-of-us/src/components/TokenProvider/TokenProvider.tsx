'use client';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { getClient } from '@/utils/client';
import { env } from '@/utils/env';
import { differenceInMinutes, isPast } from 'date-fns';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface ITokenContext {
  tokens: IToken[] | undefined;
  isLoading: boolean;
  removeTokenFromData: (token: IToken) => void;
  addMintingData: (proofOfUs: IProofOfUsData) => void;
}

export const TokenContext = createContext<ITokenContext>({
  tokens: [],
  isLoading: false,
  removeTokenFromData: (token: IToken) => {},
  addMintingData: (proofOfUs: IProofOfUsData) => {},
});

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
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [mintingTokens, setMintingTokens] = useState<IToken[]>([]);
  const [successTokens, setSuccessTokens] = useState<IToken[]>([]);
  const { data, isLoading } = useGetAllProofOfUs();

  //const [listeners, setListeners] = useState<IListener[]>([]);
  // const { account } = useAccount();

  // useEffect(() => {
  //   if (Array.isArray(tokens)) {
  //     setIsLoading(false);
  //   }
  // }, [tokens]);

  // useEffect(() => {
  //   if (!account) return;
  //   setIsLoading(true);
  //   store.listenToUser(account, setTokens);
  // }, [account]);

  const storageListener = (event: StorageEvent) => {
    if (event.key === 'mintingTokens') {
      setMintingTokens(getMintingTokensFromLocalStorage());
    }
  };

  useEffect(() => {
    setMintingTokens(getMintingTokensFromLocalStorage());
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setTokens(data as IToken[]);
  }, [data]);

  const removeMintingToken = (token: IToken) => {
    setMintingTokens((v) => {
      const newArray = v.filter((t) => t.requestKey !== token.requestKey);
      localStorage.setItem('mintingTokens', JSON.stringify(newArray));
      return newArray;
    });
  };

  const updateToken = async (
    tokenId: string,
    token: IToken,
    mintStatus: 'error' | 'success',
  ) => {
    removeMintingToken(token);

    if (mintStatus === 'success') {
      setSuccessTokens((v) => {
        const newArray = [...v];
        delete token.proofOfUsId;
        if (!v.find((t) => t.requestKey === token.requestKey)) {
          newArray.push(token);
        }
        return newArray;
      });
    }
  };
  const listenAll = async () => {
    for (let i = 0; i < mintingTokens.length; i++) {
      const token = mintingTokens[i];

      if (!token.requestKey || !token.listener || !token.mintStartDate) return;

      try {
        const promises = await Promise.all([
          isDateOlderThan5Minutes(new Date(token.mintStartDate)),
          token.listener,
        ]);

        console.log(promises[1][token.requestKey]);
        if (
          promises[1] &&
          promises[1][token.requestKey] &&
          promises[1][token.requestKey].result?.status === 'success'
        ) {
          updateToken(
            promises[1][token.requestKey].result.data,
            token,
            'success',
          );
        }
        if (
          promises[1] &&
          promises[1][token.requestKey] &&
          promises[1][token.requestKey].result?.status === 'failure'
        ) {
          updateToken(
            promises[1][token.requestKey].result.data,
            token,
            'error',
          );
        }
        if (promises[0]) {
          removeMintingToken(token);
        }
      } catch (e) {
        console.error(e);
        removeMintingToken(token);
      }
    }
  };
  useEffect(() => {
    listenAll();
  }, [mintingTokens]);

  async function listenForMinting(data: IToken) {
    try {
      const isAlreadyListening = !!data.listener;
      if (isAlreadyListening || !data.requestKey) return;

      data.listener = getClient().pollStatus({
        requestKey: data.requestKey,
        chainId: env.CHAINID,
        networkId: env.NETWORKID,
      });

      setMintingTokens((v) =>
        v.map((item) => (item.requestKey === data.requestKey ? data : item)),
      );
    } catch (e) {
      console.error(data.requestKey, e);
    }
  }

  function getMintingTokensFromLocalStorage(): IToken[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const rawMintingTokensData = localStorage.getItem('mintingTokens') || '[]';

    const mintingTokensData = JSON.parse(rawMintingTokensData) as IToken[];
    mintingTokensData.forEach((data) => {
      listenForMinting(data);
    });

    return mintingTokensData;
  }

  const removeTokenFromData = useCallback((token: IToken) => {
    const newTokens = tokens?.filter((t) => t.id !== token.id);
    setTokens(newTokens);
  }, []);

  const addMintingData = (proofOfUs: IProofOfUsData) => {
    const token: IToken = {
      proofOfUsId: proofOfUs.proofOfUsId,
      requestKey: proofOfUs.requestKey,
      id: proofOfUs.tokenId,
      mintStartDate: Date.now(),
    };

    setMintingTokens((v) => {
      const newArray = [...v];
      if (!v.find((t) => t.proofOfUsId === token.proofOfUsId)) {
        newArray.push(token);
      }

      localStorage.setItem('mintingTokens', JSON.stringify(newArray));
      return newArray;
    });
  };

  return (
    <TokenContext.Provider
      value={{
        tokens: [...mintingTokens, ...successTokens, ...(data as IToken[])],
        isLoading,
        removeTokenFromData,
        addMintingData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
