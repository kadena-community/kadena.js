'use client';
import { useNetwork } from '@/hooks/networks';
import { isAgent } from '@/services/isAgent';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { IState, IWalletAccount } from './utils';
import { getWalletConnection } from './utils';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IWalletAccount;
  error?: IAccountError;
  isMounted: boolean;
  login: () => void;
  logout: () => void;
  sign: (tx: IUnsignedCommand) => Promise<ICommand | undefined>;
  isAgent: boolean;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,
  isMounted: false,
  login: () => {},
  logout: () => {},
  sign: async () => undefined,
  isAgent: false,
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IWalletAccount>();
  const [isMounted, setIsMounted] = useState(false);
  const [isAgentState, setIsAgentState] = useState(false);
  const { activeNetwork } = useNetwork();
  const router = useRouter();

  const checkIsAgent = async (account: IWalletAccount) => {
    const resIsAgent = await isAgent(
      { agent: account.address },
      activeNetwork,
      account,
    );
    setIsAgentState(!!resIsAgent);
  };

  const login = useCallback(async () => {
    const { message, focus, close } = await getWalletConnection();
    focus();
    const response = await message('CONNECTION_REQUEST', {
      name: 'RWA-demo',
    });

    if ((response.payload as any).status !== 'accepted') {
      return;
    }
    const { payload } = await message('GET_STATUS', {
      name: 'RWA-demo',
    });

    const account = (payload as IState).accounts[0] as IWalletAccount;

    localStorage.setItem(getAccountCookieName(), JSON.stringify(account)!);
    close();
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem(getAccountCookieName());
    if (storage) {
      console.log({ account: JSON.parse(storage) });
      try {
        setAccount(JSON.parse(storage));
      } catch (e) {
        localStorage.removeItem(getAccountCookieName());
      }
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!account) {
      setIsAgentState(false);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    checkIsAgent(account);
  }, [account]);

  const sign = async (tx: IUnsignedCommand): Promise<ICommand | undefined> => {
    const { message, close } = await getWalletConnection();
    const response = await message('SIGN_REQUEST', tx as any);
    const payload: {
      status: 'signed' | 'rejected';
      transaction?: ICommand;
    } = response.payload as any;

    close();
    return payload.transaction;
  };

  return (
    <AccountContext.Provider
      value={{ account, login, logout, sign, isMounted, isAgent: isAgentState }}
    >
      {children}
    </AccountContext.Provider>
  );
};
