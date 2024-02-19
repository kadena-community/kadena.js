'use client';
import { ACCOUNT_COOKIE_NAME } from '@/constants';
import { useToasts } from '@/hooks/toast';
import { env } from '@/utils/env';
import { getReturnUrl } from '@/utils/getReturnUrl';
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
  const { addToast } = useToasts();
  const router = useRouter();
  const searchParams = useSearchParams();

  const decodeAccount = useCallback(
    (userResponse: string) => {
      if (!userResponse) return;
      try {
        const account: IAccount = JSON.parse(
          Buffer.from(userResponse, 'base64').toString(),
        );
        return account;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.log('LOGIN ERROR');
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
    const userResponse = searchParams.get('user');

    if (!userResponse) return;

    localStorage.setItem(ACCOUNT_COOKIE_NAME, userResponse);
    const account = decodeAccount(userResponse);
    setAccount(account);
    setIsMounted(true);
  }, [searchParams, setAccount, decodeAccount, setIsMounted]);

  useEffect(() => {
    const userResponse = localStorage.getItem(ACCOUNT_COOKIE_NAME);

    if (!userResponse) return;

    const acc = decodeAccount(userResponse);
    setAccount(acc);
    setIsMounted(true);
  }, [setAccount, decodeAccount, setIsMounted]);

  return (
    <AccountContext.Provider value={{ account, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
