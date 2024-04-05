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
  addMintingData: (proofOfUs: IProofOfUsData) => Promise<IToken>;
  getToken: (id: string) => IToken | undefined;
}

export const TokenContext = createContext<ITokenContext>({
  tokens: [],
  isLoading: false,
  removeTokenFromData: (token: IToken) => {},
  addMintingData: async (proofOfUs: IProofOfUsData) => ({}) as IToken,
  getToken: () => undefined,
});

const isDateOlderThan5Minutes = async (dateToCheck: Date): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      try {
        const currentDate = new Date();
        const minutesDifference = differenceInMinutes(currentDate, dateToCheck);
        if (isPast(dateToCheck) && minutesDifference > 15) {
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

  const storageListener = useCallback(
    (event: StorageEvent) => {
      if (event.key === 'mintingTokens') {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        setMintingTokens(getMintingTokensFromLocalStorage());
      }
    },
    [setMintingTokens],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
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

  const removeMintingToken = useCallback((token: IToken) => {
    setMintingTokens((v) => {
      const newArray = v.filter((t) => t.requestKey !== token.requestKey);
      localStorage.setItem('mintingTokens', JSON.stringify(newArray));
      return newArray;
    });
  }, []);

  const updateToken = useCallback(
    async (tokenId: string, token: IToken, mintStatus: 'error' | 'success') => {
      removeMintingToken(token);

      if (mintStatus === 'success') {
        setSuccessTokens((v) => {
          const newArray = [...v];
          delete token.proofOfUsId;
          delete token.listener;
          token.id = tokenId;
          if (!v.find((t) => t.requestKey === token.requestKey)) {
            newArray.push(token);
          }
          return newArray;
        });
      }
    },
    [setSuccessTokens, removeMintingToken],
  );
  const listenAll = useCallback(async () => {
    for (let i = 0; i < mintingTokens.length; i++) {
      const token = mintingTokens[i];

      if (!token.requestKey || !token.listener || !token.mintStartDate) return;

      try {
        isDateOlderThan5Minutes(new Date(token.mintStartDate))
          .then(() => {
            removeMintingToken(token);
          })
          .catch(() => {
            removeMintingToken(token);
          });

        token.listener
          .then((result) => {
            if (!token.requestKey) return;
            if (
              result &&
              result[token.requestKey] &&
              result[token.requestKey].result?.status === 'success'
            ) {
              updateToken(
                result[token.requestKey].result.data,
                token,
                'success',
              );
            } else {
              removeMintingToken(token);
            }
          })
          .catch((e) => {
            console.log({ e });
          });
      } catch (e) {
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

      data.listener = getClient()
        .pollStatus({
          requestKey: data.requestKey,
          chainId: env.CHAINID,
          networkId: env.NETWORKID,
        })
        .catch(console.log);

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
        removeMintingToken(tokenData);
        return;
      }

      if (!tokenData.id && tokenData.eventId) {
        const isMinted = await hasMinted(
          tokenData.eventId,
          account?.accountName,
        );
        if (isMinted) {
          removeMintingToken(tokenData);
          return;
        }
      }

      listenForMinting(tokenData);
    });

    return mintingTokensData;
  }, []);

  const removeTokenFromData = useCallback(
    (token: IToken) => {
      if (!tokens) return;
      const newTokens = tokens.filter((t) => t.id !== token.id);
      setTokens(newTokens);
    },
    [tokens],
  );

  const addMintingData = useCallback(
    async (proofOfUs: IProofOfUsData): Promise<IToken> => {
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
        localStorage.setItem('mintingTokens', JSON.stringify(newArray));
        return newArray;
      });

      return token;
    },
    [],
  );

  const getToken = useCallback(
    (id: string): IToken | undefined => {
      //id could be eventId or a requestkey
      return [...mintingTokens, ...successTokens, ...tokens].find(
        (token) => token.requestKey === id || token.eventId === id,
      );
    },
    [mintingTokens, successTokens],
  );

  return (
    <TokenContext.Provider
      value={{
        tokens: [...mintingTokens, ...successTokens, ...tokens],
        isLoading,
        removeTokenFromData,
        addMintingData,
        getToken,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
