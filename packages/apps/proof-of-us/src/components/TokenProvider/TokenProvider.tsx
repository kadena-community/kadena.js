'use client';
import type { Token } from '@/__generated__/sdk';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { env } from '@/utils/env';
import { createClient } from '@kadena/client';
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

const kadenaClient = createClient();

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data, isLoading, error } = useGetAllProofOfUs();
  const [mintingTokens, setMintingTokens] = useState<IProofOfUsData[]>(
    getMintingTokensFromLocalStorage(),
  );
  const [successMints, setSuccessMints] = useState<IProofOfUsData[]>([]);

  useEffect(() => {
    const rawMintingTokensData = JSON.stringify(mintingTokens ?? []);
    localStorage.setItem('mintingTokens', rawMintingTokensData);
  }, [mintingTokens]);

  const storageListener = (event: StorageEvent) => {
    console.log('storage', console.log(event));
    if (event.key === 'mintingTokens') {
      console.log('huh');
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
      const result = await kadenaClient.listen({
        requestKey: data.requestKey,
        chainId: env.CHAINID,
        networkId: env.NETWORKID,
      });
      if (result.result.status === 'success') {
        removeMintingToken(data.requestKey);
        setSuccessMints((v) => [...v, { ...data, mintStatus: 'success' }]);
      }
    } catch (e) {
      console.error(data.requestKey, e);
      // removeMintingToken(requestKey);
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

  const filterDoubles = (tokens: IProofOfUsData[]): IProofOfUsData[] => {
    const newArray = [];
    const uniqueObject: Record<string, IProofOfUsData> = {};

    for (const token of tokens) {
      // Extract the title
      const id = token.proofOfUsId;
      uniqueObject[id] = token;
    }
    // eslint-disable-next-line guard-for-in
    for (const i in uniqueObject) {
      newArray.push(uniqueObject[i]);
    }

    return newArray;
  };

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
