'use client';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useState } from 'react';

interface IToken {
  name: string;
}

export interface ITokenContext {
  token?: IToken;
}

export const TokenContext = createContext<ITokenContext>({});

export const TokenProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [token, setToken] = useState<IToken>();

  return (
    <TokenContext.Provider value={{ token }}>{children}</TokenContext.Provider>
  );
};
