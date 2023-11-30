'use client';
import { ACCOUNTCOOKIENAME } from '@/constants';
import { env } from '@/utils/env';
import { useRouter, useSearchParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useToasts } from './toast.hook';

interface IAccountError {
  message: string;
}

interface IAccountContext {
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

export const useAccount = (): IAccountContext => useContext(AccountContext);

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IAccount>();
  const { addToast } = useToasts();
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
      addToast({
        type: 'error',
        message: e.message,
      });
      return;
    }
  }, []);

  const login = useCallback(() => {
    router.push(`${env.WALLET_URL}/login?returnUrl=${getReturnUrl()}`);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCOUNTCOOKIENAME);
    setAccount(undefined);
  }, []);

  useEffect(() => {
    const response = searchParams.get('response');
    if (!response) return;

    localStorage.setItem(ACCOUNTCOOKIENAME, response);
    const account = decodeAccount(response);
    setAccount(account);
  }, [searchParams, setAccount, decodeAccount]);

  useEffect(() => {
    const response = localStorage.getItem(ACCOUNTCOOKIENAME);
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
