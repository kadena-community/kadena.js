import { env } from '@/utils/env';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { connect, initSpireKey, type Account } from '@kadena/spirekey-sdk';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
interface IAccountError {
  message: string;
}

export interface WebauthnAccountDetails {
  account:string
  guard: {
    keys: string[];
    pred: "keys-all" | "keys-2" | "keys-any";
  }
}

export interface IAccountContext {
  account?: Account;
  error?: IAccountError;
  isMounted: boolean;
  login: () => void;
  logout: () => void;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,  
  isMounted: false,
  login: () => {},
  logout: () => {},
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<Account>();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chainId = '8';

  useEffect(() => {
    initSpireKey({ hostUrl: env.WALLET_URL, useRAccount: true })
  }, []);

  const login = useCallback(async () => {
    const account = await connect(env.NETWORKID, chainId);
    setIsMounted(true);
    setAccount(account);
    localStorage.setItem(getAccountCookieName(), JSON.stringify(account));
  }, [connect]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  const loginResponse = useCallback(async () => {
    const storedAccount = localStorage.getItem(getAccountCookieName());
    if (!storedAccount) return;
    const account = JSON.parse(storedAccount);
    if (!account) return;
    setAccount(account);
    setIsMounted(true);
  }, [setAccount, setIsMounted, searchParams, router]);

  useEffect(() => {
    loginResponse();
  }, []);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
