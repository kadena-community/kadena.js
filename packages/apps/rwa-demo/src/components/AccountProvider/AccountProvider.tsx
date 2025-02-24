'use client';
import { WALLETTYPES } from '@/constants';
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

import { chainweaverAccountLogin } from '@/utils/walletTransformers/chainweaver/login';
import { chainweaverAccountLogout } from '@/utils/walletTransformers/chainweaver/logout';
import { chainweaverSignTx } from '@/utils/walletTransformers/chainweaver/signTx';
import { eckoAccountLogin } from '@/utils/walletTransformers/ecko/login';
import { eckoAccountLogout } from '@/utils/walletTransformers/ecko/logout';
import { eckoSignTx } from '@/utils/walletTransformers/ecko/signTx';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from './AccountType';

interface IAccountError {
  message: string;
}

export interface IAccountContext {
  account?: IWalletAccount;
  accounts?: IWalletAccount[];
  error?: IAccountError;
  isMounted: boolean;
  login: (type: keyof typeof WALLETTYPES) => void;
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

  const login = useCallback(
    async (type: keyof typeof WALLETTYPES) => {
      let tempAccount;
      switch (type) {
        case WALLETTYPES.ECKO:
          tempAccount = await eckoAccountLogin();
          break;
        case WALLETTYPES.CHAINWEAVER:
          const result = await chainweaverAccountLogin();
          if (result.length > 1) {
            setAccounts(result);
            return;
          } else if (result.length === 1) {
            tempAccount = result[0];
          }
      }

      if (tempAccount) {
        setAccounts(undefined);
        setAccount(tempAccount);
        localStorage.setItem(
          getAccountCookieName(),
          JSON.stringify(tempAccount),
        );

        router.replace('/');
      }
    },

    [router],
  );

  const logout = useCallback(() => {
    switch (account?.walletType) {
      case WALLETTYPES.ECKO:
        return eckoAccountLogout();
      case WALLETTYPES.CHAINWEAVER:
        return chainweaverAccountLogout();
    }
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
    switch (account?.walletType) {
      case WALLETTYPES.ECKO:
        return await eckoSignTx(tx);
      case WALLETTYPES.CHAINWEAVER:
        return await chainweaverSignTx(tx);
    }
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
