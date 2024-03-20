'use client';
import { useAccount } from '@/hooks/account';
import { useGetAllProofOfUs } from '@/hooks/data/getAllProofOfUs';
import { useHasMintedAttendaceToken } from '@/hooks/data/hasMintedAttendaceToken';
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
    const checkCondition = () => {
      try {
        const currentDate = new Date();
        const minutesDifference = differenceInMinutes(currentDate, dateToCheck);
        if (isPast(dateToCheck) && minutesDifference > 5) {
          resolve(true); // Date is older than 5 minutes
        } else {
          setTimeout(checkCondition, 1000); // Check again in 1 second
        }
      } catch (error) {
        reject(error);
      }
    };

    checkCondition();
  });
};

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [mintingTokens, setMintingTokens] = useState<IToken[]>([]);
  const [successTokens, setSuccessTokens] = useState<IToken[]>([]);
  const { data, isLoading } = useGetAllProofOfUs();
  const { hasMinted } = useHasMintedAttendaceToken();
  const { account } = useAccount();

  const storageListener = (event: StorageEvent) => {
    if (event.key === 'mintingTokens') {
      console.log('eventkey');
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      setMintingTokens(getMintingTokensFromLocalStorage());
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setMintingTokens(getMintingTokensFromLocalStorage());
    console.log('init');
    window.addEventListener('storage', storageListener);
    return () => {
      window.removeEventListener('storage', storageListener);
    };
  }, []);

  useEffect(() => {
    if (!data) return;

    setTokens(data as IToken[]);
  }, [data]);

  const removeMintingToken = useCallback((token: IToken) => {
    console.log('are we removing at all?');
    setMintingTokens((v) => {
      const newArray = v.filter((t) => t.requestKey !== token.requestKey);
      localStorage.setItem('mintingTokens', JSON.stringify(newArray));
      return newArray;
    });
  }, []);

  const updateToken = useCallback(
    async (tokenId: string, token: IToken, mintStatus: 'error' | 'success') => {
      console.log('success', mintStatus, token);
      removeMintingToken(token);

      if (mintStatus === 'success') {
        setSuccessTokens((v) => {
          const newArray = [...v];
          delete token.proofOfUsId;
          delete token.listener;
          if (!v.find((t) => t.requestKey === token.requestKey)) {
            newArray.push(token);
          }
          return newArray;
        });
      }
    },
    [tokens],
  );
  const listenAll = useCallback(async () => {
    for (let i = 0; i < mintingTokens.length; i++) {
      const token = mintingTokens[i];

      if (!token.requestKey || !token.listener || !token.mintStartDate) return;

      try {
        isDateOlderThan5Minutes(new Date(token.mintStartDate))
          .then(() => {
            console.log('timeout?');
            removeMintingToken(token);
          })
          .catch(() => {
            console.log('timeout?');
            removeMintingToken(token);
          });

        token.listener.then((result) => {
          if (!token.requestKey) return;
          if (
            result &&
            result[token.requestKey] &&
            result[token.requestKey].result?.status === 'success'
          ) {
            updateToken(result[token.requestKey].result.data, token, 'success');
          } else {
            removeMintingToken(token);
          }
        });
      } catch (e) {
        console.log('catch fail');
        console.error(e);
        removeMintingToken(token);
      }
    }
  }, [tokens, mintingTokens]);

  useEffect(() => {
    listenAll();
  }, [mintingTokens]);

  const listenForMinting = useCallback(async (data: IToken) => {
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
  }, []);

  const getMintingTokensFromLocalStorage = useCallback((): IToken[] => {
    if (typeof window === 'undefined') {
      return [];
    }

    const rawMintingTokensData = localStorage.getItem('mintingTokens') || '[]';

    const mintingTokensData = JSON.parse(rawMintingTokensData) as IToken[];
    mintingTokensData.forEach(async (tokenData) => {
      //remove listener data, because that will be a function (promise listening to the chain)
      delete tokenData.listener;

      //check if the tokenid is not already in the data
      //if it is we can remove this mintingtoken
      if (tokens.find((t) => t.id === tokenData.id)) {
        console.log('remove');
        removeMintingToken(tokenData);
        return;
      }

      if (!tokenData.id && tokenData.eventId) {
        const isMinted = await hasMinted(
          tokenData.eventId,
          account?.accountName,
        );
        if (isMinted) {
          console.log('remove isminted');
          removeMintingToken(tokenData);
          return;
        }
      }

      listenForMinting(tokenData);
    });

    return mintingTokensData;
  }, [tokens, account]);

  const removeTokenFromData = useCallback(
    (token: IToken) => {
      if (!tokens) return;
      const newTokens = tokens.filter((t) => t.id !== token.id);
      setTokens(newTokens);
    },
    [tokens],
  );

  const addMintingData = useCallback(async (proofOfUs: IProofOfUsData) => {
    const token: IToken = {
      eventId: proofOfUs.eventId,
      proofOfUsId: proofOfUs.proofOfUsId,
      requestKey: proofOfUs.requestKey,
      info: {
        uri: proofOfUs.manifestUri ?? '',
      },
      id: proofOfUs.tokenId,
      mintStartDate: Date.now(),
    };

    setMintingTokens((v) => {
      const newArray = [...v];
      if (!v.find((t) => t.requestKey === token.requestKey)) {
        newArray.push(token);
      }

      console.log({ newArray });
      localStorage.setItem('mintingTokens', JSON.stringify(newArray));
      return newArray;
    });
  }, []);

  console.log({ mintingTokens, successTokens });
  return (
    <TokenContext.Provider
      value={{
        tokens: [...mintingTokens, ...successTokens, ...tokens],
        isLoading,
        removeTokenFromData,
        addMintingData,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
