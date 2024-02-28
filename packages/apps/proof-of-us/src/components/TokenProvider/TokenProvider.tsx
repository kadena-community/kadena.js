'use client';
import type { Token } from '@/__generated__/sdk';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { getClient } from '@/utils/client';
import { env } from '@/utils/env';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useEffect, useState } from 'react';

export interface ITokenContext {
  addMintingData: (proofOfUs: IProofOfUsData) => void;
  tokens: (IProofOfUsData | Token)[];
  isLoading: boolean;
  error?: IError;
}

export const TokenContext = createContext<ITokenContext>({
  addMintingData: () => {},
  tokens: [],
  isLoading: false,
});

const kadenaClient = getClient();

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading, error } = useGetAllProofOfUs();
  const [mintingTokens, setMintingTokens] = useState<IProofOfUsData[]>(
    getMintingTokensFromLocalStorage(),
  );
  const [successMints, setSuccessMints] = useState<IProofOfUsData[]>([]);

  useEffect(() => {
    const rawMintingTokensData = JSON.stringify(
      filterDoubles(mintingTokens) ?? [],
    );
    localStorage.setItem('mintingTokens', rawMintingTokensData);
  }, [mintingTokens]);

  const storageListener = (event: StorageEvent) => {
    if (event.key === 'mintingTokens') {
      setMintingTokens(getMintingTokensFromLocalStorage());
    }
  };

  useEffect(() => {
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  async function listenForMinting(data: IProofOfUsData) {
    try {
      const result = (
        await kadenaClient.pollStatus({
          requestKey: data.requestKey,
          chainId: env.CHAINID,
          networkId: env.NETWORKID,
        })
      )[data.requestKey];
      if (result.result.status === 'success') {
        removeMintingToken(data.requestKey);
        setSuccessMints((v) => [...v, { ...data, mintStatus: 'success' }]);
      }
    } catch (e) {
      console.error(data.requestKey, e);
      removeMintingToken(data.requestKey);
    }
  }

  function removeMintingToken(requestKey: string) {
    const newTokens = mintingTokens.filter(
      (data) => data.requestKey !== requestKey,
    );

    setMintingTokens(newTokens);
  }

  function getMintingTokensFromLocalStorage(): IProofOfUsData[] {
    if (typeof window === 'undefined') {
      return [];
    }

    const rawMintingTokensData = localStorage.getItem('mintingTokens') || '[]';

    const mintingTokensData = JSON.parse(
      rawMintingTokensData,
    ) as IProofOfUsData[];
    mintingTokensData.forEach((data) => {
      listenForMinting(data);
    });

    return mintingTokensData;
  }

  const isDataAlreadyLocal = (proofOfUs: IProofOfUsData): boolean => {
    return !!mintingTokens.find(
      (data) => data.proofOfUsId === proofOfUs.proofOfUsId,
    );
  };

  const addMintingData = (proofOfUs: IProofOfUsData) => {
    if (
      (!proofOfUs.tokenId && !proofOfUs.requestKey) ||
      isDataAlreadyLocal(proofOfUs)
    )
      return;
    setMintingTokens((v) => [...v, proofOfUs]);
  };

  function filterDoubles(tokens: IProofOfUsData[]): IProofOfUsData[] {
    const newArray = [];
    const uniqueObject: Record<string, IProofOfUsData> = {};

    for (const token of tokens) {
      const id = token.proofOfUsId;
      uniqueObject[id] = token;
    }
    // eslint-disable-next-line guard-for-in
    for (const i in uniqueObject) {
      //check if the item is not already in the data.
      const foundInData = data.find((d) => d.id === uniqueObject[i].requestKey);
      if (!foundInData) newArray.push(uniqueObject[i]);
    }

    return newArray;
  }

  return (
    <TokenContext.Provider
      value={{
        addMintingData,
        tokens: [
          ...filterDoubles(mintingTokens),
          ...filterDoubles(successMints),
          ...data,
        ],

        isLoading,
        error,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
