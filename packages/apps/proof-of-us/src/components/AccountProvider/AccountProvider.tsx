'use client';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { store } from '@/utils/socket/store';
import { connect, initSpireKey } from '@kadena/spirekey-sdk';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IAccount;
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
  const [account, setAccount] = useState<IAccount>();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const login = useCallback(async () => {
    const acc = await connect('development', '1');
    setAccount(acc);
    setIsMounted(true);
    localStorage.setItem(getAccountCookieName(), JSON.stringify(acc));
    store.saveAlias(account);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  useEffect(() => {
    initSpireKey();
  }, []);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
