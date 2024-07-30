import { details } from "@kadena/client-utils/coin"
import { getWebauthnGuard, getWebauthnAccount } from "@kadena/client-utils/webauthn";
import { env } from '@/utils/env';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { connect, type Account } from '@kadena/spirekey-sdk';
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
  accountGuard: object | undefined;
  webauthnAccount?: WebauthnAccountDetails;
  error?: IAccountError;
  isMounted: boolean;
  login: () => void;
  logout: () => void;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,
  accountGuard: undefined,
  webauthnAccount: undefined,
  isMounted: false,
  login: () => {},
  logout: () => {},
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<Account>();
  const [accountGuard, setAccountGuard] = useState<object | undefined>();
  const [webauthnAccount, setWebauthnAccount] = useState<WebauthnAccountDetails>();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chainId = '8';

  const login = useCallback(async () => {
    const account = await connect(env.NETWORKID, chainId);
    console.log(account)
    setIsMounted(true);
    setAccount(account);
    localStorage.setItem(getAccountCookieName(), JSON.stringify(account));
  }, [connect]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  const getWebauthnAccountDetails = async (account: string): Promise<WebauthnAccountDetails> => {
    const webauthnAccount:string = await getWebauthnAccount({
      account: account,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId,
    }) as string

    const webauthnGuard = await getWebauthnGuard({
      account: account,
      host: env.URL,
      networkId: env.NETWORKID,
      chainId,
    }) as {
      keys: string[];
      pred: "keys-all" | "keys-2" | "keys-any";
    }

    return {
      account:webauthnAccount,
      guard:webauthnGuard
    }
  };

  const loginResponse = useCallback(async () => {
    const storedAccount = localStorage.getItem(getAccountCookieName());
    if (!storedAccount) return;
    const account = JSON.parse(storedAccount);
    if (!account) return;
    setAccount(account);
    const accountInfo:{guard?:any} = await details(account?.accountName || '', env.NETWORKID, chainId);
    setAccountGuard(accountInfo.guard);
    const accountDetails = await getWebauthnAccountDetails(account?.accountName || '');
    setWebauthnAccount(accountDetails);
    setIsMounted(true);
  }, [setAccount, setIsMounted, searchParams, router]);

  useEffect(() => {
    loginResponse();
  }, []);

  console.log({ account }, account?.accountName);

  return (
    <AccountContext.Provider value={{ account, accountGuard, webauthnAccount, login, logout, isMounted }}>
      {children}
    </AccountContext.Provider>
  );
};
