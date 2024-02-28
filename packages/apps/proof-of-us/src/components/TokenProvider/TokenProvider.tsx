'use client';
import { useAccount } from '@/hooks/account';

import { store } from '@/utils/socket/store';
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

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokens, setTokens] = useState<IProofOfUsData[]>();
  const [isLoading, setIsLoading] = useState(false);
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

  // async function listenForMinting(data: IProofOfUsTokenMetaWithkey) {
  //   try {
  //     // const result = (
  //     //   await kadenaClient.pollStatus({
  //     //     requestKey: data.requestKey,
  //     //     chainId: env.CHAINID,
  //     //     networkId: env.NETWORKID,
  //     //   })
  //     // )[data.requestKey];
  //   } catch (e) {
  //     console.error(data.requestKey, e);
  //   }
  // }

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
