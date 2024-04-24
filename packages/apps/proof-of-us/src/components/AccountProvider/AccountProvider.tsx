'use client';
import { env } from '@/utils/env';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { getReturnUrl } from '@/utils/getReturnUrl';
import { store } from '@/utils/socket/store';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();

  const decodeAccount = useCallback((userResponse: string) => {
    if (!userResponse) return;
    try {
      const account: IAccount = JSON.parse(
        Buffer.from(userResponse, 'base64').toString(),
      );
      return account;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return;
    }
  }, []);

  const login = useCallback(() => {
    router.push(
      `${env.WALLET_URL}/connect?returnUrl=${getReturnUrl([
        'user',
      ])}&networkId=${env.NETWORKID}&chainId=${env.CHAINID}&optimistic=true`,
    );
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  const loginResponse = useCallback(async () => {
    const innerSearchParams = new URLSearchParams(window.location.search);
    const userResponse = innerSearchParams.has('user')
      ? innerSearchParams.get('user')
      : localStorage.getItem(getAccountCookieName());

    if (!userResponse) {
      setIsMounted(true);
      return;
    }

    if (innerSearchParams.has('user')) {
      localStorage.setItem(getAccountCookieName(), userResponse);
    }
    const account = decodeAccount(userResponse);
    store.saveAlias(account);
    setAccount(account);
    setIsMounted(true);

    if (searchParams.has('user')) {
      setTimeout(() => {
        router.replace(getReturnUrl(['user']));
      }, 100);
    }
  }, [setAccount, setIsMounted, searchParams, decodeAccount, router]);

  useEffect(() => {
    loginResponse();
  }, []);

  console.log({ account }, account?.accountName);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
