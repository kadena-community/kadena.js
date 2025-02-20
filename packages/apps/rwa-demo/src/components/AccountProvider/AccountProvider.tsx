'use client';
import { useGetAccountKDABalance } from '@/hooks/getAccountKDABalance';
import type { IAgentHookProps } from '@/hooks/getAgentRoles';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { isAgent } from '@/services/isAgent';
import { isComplianceOwner } from '@/services/isComplianceOwner';
import { isFrozen } from '@/services/isFrozen';
import { isInvestor } from '@/services/isInvestor';
import { isOwner } from '@/services/isOwner';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from './AccountType';
import type { IState } from './utils';
import { getWalletConnection } from './utils';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IWalletAccount;
  accounts?: IWalletAccount[];
  error?: IAccountError;
  isMounted: boolean;
  login: () => void;
  logout: () => void;
  sign: (tx: IUnsignedCommand) => Promise<ICommand | undefined>;
  isAgent: boolean;
  isOwner: boolean;
  isComplianceOwner: boolean;
  isInvestor: boolean;
  isFrozen: boolean;
  selectAccount: (account: IWalletAccount) => void;
  balance: number;
  accountRoles: IAgentHookProps;
  isGasPayable: boolean;
}

export const AccountContext = createContext<IAccountContext>({
  account: undefined,
  accounts: undefined,
  isMounted: false,
  login: () => {},
  logout: () => {},
  sign: async () => undefined,
  isAgent: false,
  isOwner: false,
  isComplianceOwner: false,
  isInvestor: false,
  isFrozen: false,
  selectAccount: () => {},
  balance: 0,
  accountRoles: {
    isMounted: false,
    getAll: () => [],
    isAgentAdmin: () => {
      return false;
    },
    isFreezer: () => false,
    isTransferManager: () => false,
  },
  isGasPayable: false,
});

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IWalletAccount>();
  const [accounts, setAccounts] = useState<IWalletAccount[]>();
  const [isMounted, setIsMounted] = useState(false);
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isComplianceOwnerState, setIsComplianceOwnerState] = useState(false);
  const [isAgentState, setIsAgentState] = useState(false);
  const [isInvestorState, setIsInvestorState] = useState(false);
  const [isFrozenState, setIsFrozenState] = useState(false);
  const { data: kdaBalance } = useGetAccountKDABalance({
    accountAddress: account?.address,
  });
  const { ...accountRoles } = useGetAgentRoles({
    agent: account?.address,
  });
  const { data: balance } = useGetInvestorBalance({
    investorAccount: account?.address,
  });
  const router = useRouter();

  const checkIsAgent = async (account: IWalletAccount) => {
    const resIsAgent = await isAgent({ agent: account.address });
    setIsAgentState(!!resIsAgent);
  };
  const checkIsOwner = async (account: IWalletAccount) => {
    const resIsOwner = await isOwner({ owner: account.address });
    setIsOwnerState(!!resIsOwner);
  };
  const checkIsComplianceOwner = async (account: IWalletAccount) => {
    const resIsComplianceOwner = await isComplianceOwner({
      owner: account.address,
    });
    setIsComplianceOwnerState(!!resIsComplianceOwner);
  };
  const checkIsInvestor = async (account: IWalletAccount) => {
    const resIsInvestor = await isInvestor({ account });
    setIsInvestorState(!!resIsInvestor);
  };
  const checkIsFrozen = async (account: IWalletAccount) => {
    const res = await isFrozen({
      investorAccount: account.address,
      account: account!,
    });

    if (typeof res === 'boolean') {
      setIsFrozenState(res);
    }
  };

  const selectAccount = (account: IWalletAccount) => {
    setAccount(account);

    localStorage.setItem(getAccountCookieName(), JSON.stringify(account)!);
    router.replace('/');
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
    const { payload } = (await message('GET_STATUS', {
      name: 'RWA-demo',
    })) as { payload: IState };

    if (payload.accounts.length > 1) {
      setAccounts(payload.accounts);
      close();
      return;
    }

    setAccounts(undefined);
    setAccount(payload.accounts[0]);
    localStorage.setItem(
      getAccountCookieName(),
      JSON.stringify(payload.accounts[0]),
    );
    close();
    router.replace('/');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, []);

  useEffect(() => {
    const storage = localStorage.getItem(getAccountCookieName());

    if (storage && storage !== 'undefined') {
      console.log({ account: JSON.parse(storage) });
      try {
        setAccount(JSON.parse(storage));
      } catch (e) {
        localStorage.removeItem(getAccountCookieName());
      }
    }
  }, [account?.address]);

  const initProps = async (accountProp?: IWalletAccount) => {
    if (!accountProp) {
      setIsMounted(true);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    Promise.allSettled([
      checkIsOwner(accountProp),
      checkIsComplianceOwner(accountProp),
      checkIsInvestor(accountProp),
      checkIsAgent(accountProp),
      checkIsFrozen(accountProp),
    ]).then((v) => {
      setIsMounted(true);
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initProps(account);
  }, [account?.address]);

  useEffect(() => {
    if (!account?.address) {
      setIsAgentState(false);
      setIsOwnerState(false);
      setIsComplianceOwnerState(false);
      setIsInvestorState(false);
      return;
    }
  }, [account?.address]);

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
      value={{
        account,
        accounts,
        login,
        logout,
        sign,
        isMounted,
        isOwner: isOwnerState,
        isComplianceOwner: isComplianceOwnerState,
        isAgent: isAgentState,
        isInvestor: isInvestorState,
        isFrozen: isFrozenState,
        selectAccount,
        balance,
        accountRoles,
        isGasPayable: kdaBalance > 0,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
