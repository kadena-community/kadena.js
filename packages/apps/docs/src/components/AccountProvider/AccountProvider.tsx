'use client';
import type { IAccount } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import React, { createContext, useCallback, useEffect, useState } from 'react';

const ACCOUNT_COOKIE_NAME = process.env.NEXT_PUBLIC_ACCOUNT_COOKIE_NAME;
const WALLET_URL = process.env.NEXT_PUBLIC_WALLET_URL;

if (!WALLET_URL) throw new Error('WALLET_URL not set');
if (!ACCOUNT_COOKIE_NAME) throw new Error('ACCOUNT_COOKIE_NAME not set');

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const getReturnUrl = () => {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  };

  const decodeAccount = useCallback((response: string) => {
    if (!response) return;
    try {
      const account: IAccount = JSON.parse(
        Buffer.from(response, 'base64').toString(),
      );
      return account;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return;
    }
  }, []);

  const login = useCallback(() => {
    router.push(`${WALLET_URL}/login?returnUrl=${getReturnUrl()}`);
  }, []);

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
