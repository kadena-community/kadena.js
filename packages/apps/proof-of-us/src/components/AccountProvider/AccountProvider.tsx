'use client';
import { env } from '@/utils/env';
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
    try {
      const acc = await connect(env.NETWORKID, env.CHAINID);
      setAccount(acc);
      setIsMounted(true);
      localStorage.setItem(getAccountCookieName(), JSON.stringify(acc));
      store.saveAlias(account);
    } catch (e) {
      localStorage.removeItem(getAccountCookieName());
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem(getAccountCookieName());
    if (storage) {
      try {
        setAccount(JSON.parse(storage));
      } catch (e) {
        localStorage.removeItem(getAccountCookieName());
      }
    }

    initSpireKey({
      hostUrl: 'https://spirekey.kadena.io',
    });
    setIsMounted(true);
  }, []);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
