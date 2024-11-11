'use client';
import { env } from '@/utils/env';
import { getAccountCookieName } from '@/utils/getAccountCookieName';

import type { ConnectedAccount } from '@kadena/spirekey-sdk';
import { connect } from '@kadena/spirekey-sdk';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: ConnectedAccount;
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
  const [account, setAccount] = useState<ConnectedAccount>();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const login = useCallback(async () => {
    try {
      setIsMounted(true);
      const acc = await connect(env.NETWORKID, env.CHAINID);
      setAccount(acc);
      localStorage.setItem(getAccountCookieName(), JSON.stringify(acc));
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

    setIsMounted(true);
  }, []);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
