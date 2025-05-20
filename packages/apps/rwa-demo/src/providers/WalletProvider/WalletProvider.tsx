'use client';
import { WALLETTYPES } from '@/constants';
import { WalletContext } from '@/contexts/WalletContext/WalletContext';
import { useGetAccountKDABalance } from '@/hooks/getAccountKDABalance';
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
import { magicAccountLogin } from '@/utils/walletTransformers/magic/login';
import { magicAccountLogout } from '@/utils/walletTransformers/magic/logout';
import { magicSignTx } from '@/utils/walletTransformers/magic/signTx';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from './WalletType';

export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IWalletAccount>();
  const [accounts, setAccounts] = useState<IWalletAccount[]>();
  const { addNotification } = useNotifications();
  const [isMounted, setIsMounted] = useState(false);
  const [isOwnerState, setIsOwnerState] = useState(false);
  const [isComplianceOwnerState, setIsComplianceOwnerState] = useState(false);
  const [isAgentState, setIsAgentState] = useState(false);
  const [isInvestorState, setIsInvestorState] = useState(false);
  const [isFrozenState, setIsFrozenState] = useState(false);
  const { data: kdaBalance, isMounted: isBalanceMounted } =
    useGetAccountKDABalance({
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
    const resIsOwner = await isOwner({ account });
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
    async (name: keyof typeof WALLETTYPES) => {
      let tempAccount;
      switch (name) {
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
          break;
        case WALLETTYPES.MAGIC:
          tempAccount = await magicAccountLogin();
          break;
        default:
          addNotification({
            intent: 'negative',
            label: 'Provider does not exist',
            message: `Provider (${name}) does not exist`,
          });
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

  const logout = useCallback(async () => {
    switch (account?.walletName) {
      case WALLETTYPES.ECKO:
        await eckoAccountLogout();
        break;
      case WALLETTYPES.CHAINWEAVER:
        await chainweaverAccountLogout();
        break;
      case WALLETTYPES.MAGIC:
        await magicAccountLogout();
        break;
      default:
        addNotification({
          intent: 'negative',
          label: 'Provider does not exist',
          message: `Provider (${account?.walletName}) does not exist`,
        });
    }

    localStorage.removeItem(getAccountCookieName());
    setAccount(undefined);
    router.replace('/');
  }, [account]);

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
    switch (account?.walletName) {
      case WALLETTYPES.ECKO:
        return await eckoSignTx(tx);
      case WALLETTYPES.CHAINWEAVER:
        return await chainweaverSignTx(tx);
      case WALLETTYPES.MAGIC:
        return await magicSignTx(tx);
      default:
        addNotification({
          intent: 'negative',
          label: 'Provider does not exist',
          message: `Provider (${account?.walletType}) does not exist`,
        });
    }
  };

  return (
    <WalletContext.Provider
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
        isGasPayable: !isBalanceMounted ? undefined : kdaBalance > 0,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
