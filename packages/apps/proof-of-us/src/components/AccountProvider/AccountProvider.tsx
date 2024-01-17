'use client';
import { ACCOUNT_COOKIE_NAME } from '@/constants';
import { useToasts } from '@/hooks/toast';
import { env } from '@/utils/env';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IAccount;
  error?: IAccountError;
  login: () => void;
  logout: () => void;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,
  login: () => {},
  logout: () => {},
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IAccount>();
  const { addToast } = useToasts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getReturnUrl = () => {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  };

  const decodeAccount = useCallback(
    (response: string) => {
      if (!response) return;
      try {
        const account: IAccount = JSON.parse(
          Buffer.from(response, 'base64').toString(),
        );
        return account;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        addToast({
          type: 'error',
          message: e.message,
        });
        return;
      }
    },
    [addToast],
  );

  const login = useCallback(() => {
    router.push(`${env.WALLET_URL}/login?returnUrl=${getReturnUrl()}`);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCOUNT_COOKIE_NAME);
    setAccount(undefined);
  }, []);

  useEffect(() => {
    const response = searchParams.get('response');
    if (!response) return;

    localStorage.setItem(ACCOUNT_COOKIE_NAME, response);
    const account = decodeAccount(response);
    setAccount(account);
  }, [searchParams, setAccount, decodeAccount]);

  useEffect(() => {
    const response = localStorage.getItem(ACCOUNT_COOKIE_NAME);
    if (!response) return;
    const account = decodeAccount(response);
    setAccount(account);
  }, [setAccount, decodeAccount]);

  return (
    <AccountContext.Provider value={{ account, login, logout }}>
      {children}
    </AccountContext.Provider>
  );
};
