'use client';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

export interface ITokenContext {
  tokens: IToken[] | undefined;
  isLoading: boolean;
  removeTokenFromData: (token: IToken) => void;
}

export const TokenContext = createContext<ITokenContext>({
  tokens: [],
  isLoading: false,
  removeTokenFromData: (token: IToken) => {},
});

// const isDateOlderThan5Minutes = async (dateToCheck: Date): Promise<boolean> => {
//   return new Promise((resolve, reject) => {
//     try {
//       const currentDate = new Date();
//       const minutesDifference = differenceInMinutes(currentDate, dateToCheck);

//       if (isPast(dateToCheck) && minutesDifference > 10) {
//         resolve(true); // Date is older than 5 minutes
//       } else {
//         resolve(false); // Date is not older than 5 minutes
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [mintingTokens, setMintingTokens] = useState<IToken[]>([]);
  const { data, isLoading } = useGetAllProofOfUs();

  useEffect(() => {
    const dataStr = localStorage.getItem('mintingTokens') ?? '[]';
    setMintingTokens(JSON.parse(dataStr));
  }, []);

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

  // useEffect(() => {
  //   if (!data) return;

  //   const tokens: IToken[] = data.map((t) => ({
  //     tokenId: t.id,
  //     uri: t.info?.uri ?? '',
  //   }));

  //   setTokens(tokens);
  // }, [data]);

  // const removeMintingToken = (listener: IListener) => {
  //   const filtered = listeners.filter(
  //     (l) => l.proofOfUsId !== listener.proofOfUsId,
  //   );
  //   setListeners(filtered);
  // };

  // const updateToken = async (
  //   tokenId: string,
  //   listener: IListener,
  //   mintStatus: 'error' | 'success',
  // ) => {
  //   const token = tokens?.find((t) => t.proofOfUsId === listener.proofOfUsId);
  //   if (!token) return;

  //   const signees = token.signees.map((s) => ({
  //     ...s,
  //     signerStatus: 'success',
  //   })) as IProofOfUsSignee[];

  //   console.log('update in tokenprovider', signees);
  //   store.updateProofOfUs(
  //     { ...token, signees },
  //     {
  //       tokenId,
  //       mintStatus,
  //     },
  //   );
  // };
  // const listenAll = async () => {
  //   for (let i = 0; i < listeners.length; i++) {
  //     const listener = listeners[i];

  //     try {
  //       const promises = await Promise.all([
  //         isDateOlderThan5Minutes(new Date(listener.startDate)),
  //         listener.listener,
  //       ]);

  //       console.log(promises[1][listener.requestKey]);
  //       if (
  //         promises[1] &&
  //         promises[1][listener.requestKey] &&
  //         promises[1][listener.requestKey].result?.status === 'success'
  //       ) {
  //         updateToken(
  //           promises[1][listener.requestKey].result.data,
  //           listener,
  //           'success',
  //         );
  //       }
  //       if (
  //         promises[1] &&
  //         promises[1][listener.requestKey] &&
  //         promises[1][listener.requestKey].result?.status === 'failure'
  //       ) {
  //         updateToken(
  //           promises[1][listener.requestKey].result.data,
  //           listener,
  //           'error',
  //         );
  //       }
  //       if (promises[0]) {
  //         removeMintingToken(listener);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //       updateToken('', listener, 'error');
  //       removeMintingToken(listener);
  //     }
  //   }
  // };
  // useEffect(() => {
  //   listenAll();
  // }, [listeners]);

  // async function listenForMinting(data: IProofOfUsData) {
  //   try {
  //     const isAlreadyListening = listeners.find(
  //       (listener) => listener.proofOfUsId === data.proofOfUsId,
  //     );
  //     if (isAlreadyListening || data.mintStatus === 'success') return;

  //     const listener = getClient().pollStatus({
  //       requestKey: data.requestKey,
  //       chainId: env.CHAINID,
  //       networkId: env.NETWORKID,
  //     });

  //     const obj = {
  //       proofOfUsId: data.proofOfUsId,
  //       requestKey: data.requestKey,
  //       listener,
  //       startDate: data.date,
  //     } as IListener;

  //     setListeners((v) => [...v, obj]);
  //   } catch (e) {
  //     console.error(data.requestKey, e);
  //   }
  // }

  const removeTokenFromData = useCallback((token: IToken) => {
    const newTokens = data?.filter((t) => t.id !== token.id);
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
        tokens: data,
        isLoading,
        removeTokenFromData,
        addMintingData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
