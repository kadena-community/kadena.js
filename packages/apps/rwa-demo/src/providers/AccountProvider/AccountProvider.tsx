'use client';
import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { WALLETTYPES } from '@/constants';
import { AccountContext } from '@/contexts/AccountContext/AccountContext';
import { useGetAccountKDABalance } from '@/hooks/getAccountKDABalance';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import { useGetInvestorBalance } from '@/hooks/getInvestorBalance';
import { useUser } from '@/hooks/user';
import { isAgent } from '@/services/isAgent';
import { isComplianceOwner } from '@/services/isComplianceOwner';
import { isFrozen } from '@/services/isFrozen';
import { isInvestor } from '@/services/isInvestor';
import { isOwner } from '@/services/isOwner';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import { chainweaverAccountLogin } from '@/utils/walletTransformers/chainweaver/login';
import { chainweaverSignTx } from '@/utils/walletTransformers/chainweaver/signTx';
import { eckoAccountLogin } from '@/utils/walletTransformers/ecko/login';
import { eckoSignTx } from '@/utils/walletTransformers/ecko/signTx';
import { magicAccountLogin } from '@/utils/walletTransformers/magic/login';
import { magicSignTx } from '@/utils/walletTransformers/magic/signTx';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useCallback, useEffect, useState } from 'react';
import type { IWalletAccount } from './AccountType';

export const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [account, setAccount] = useState<IWalletAccount>();
  const {
    addAccount: addAccount2User,
    removeAccount: removeAccountFromUser,
    userData,
  } = useUser();
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
  const { setAssetRolesForAccount, ...accountRoles } = useGetAgentRoles();
  const { data: balance } = useGetInvestorBalance({
    investorAccount: account?.address,
  });
  const router = useRouter();

  const checkIsAgent = async (account: IWalletAccount, asset?: IAsset) => {
    if (!account || !asset) {
      setIsAgentState(false);
      return;
    }

    const resIsAgent = await isAgent({ agent: account.address }, asset);
    setIsAgentState(!!resIsAgent);
  };
  const checkIsOwner = async (account: IWalletAccount, asset?: IAsset) => {
    if (!account || !asset) {
      setIsOwnerState(false);
      return;
    }
    const resIsOwner = await isOwner({ account }, asset);
    setIsOwnerState(!!resIsOwner);
  };
  const checkIsComplianceOwner = async (
    account: IWalletAccount,
    asset?: IAsset,
  ) => {
    if (!account || !asset) {
      setIsComplianceOwnerState(false);
      return;
    }
    const resIsComplianceOwner = await isComplianceOwner({
      owner: account.address,
      asset,
    });
    setIsComplianceOwnerState(!!resIsComplianceOwner);
  };
  const checkIsInvestor = async (account: IWalletAccount, asset?: IAsset) => {
    if (!account || !asset) {
      setIsInvestorState(false);
      return;
    }
    const resIsInvestor = await isInvestor({ account }, asset);
    setIsInvestorState(!!resIsInvestor);
  };
  const checkIsFrozen = async (account: IWalletAccount, asset?: IAsset) => {
    if (!account || !asset) {
      setIsFrozenState(false);
      return;
    }

    const res = await isFrozen(
      {
        investorAccount: account.address,
        account: account!,
      },
      asset,
    );

    if (typeof res === 'boolean') {
      setIsFrozenState(res);
    }
  };

  const selectAccount = (address: string) => {
    const found = userData?.accounts.find((a) => a.address === address);
    setAccount(found);
    if (found) {
      localStorage.setItem(getAccountCookieName(), found.address);
    } else {
      localStorage.removeItem(getAccountCookieName());
    }
    router.replace('/');
  };

  const addAccount = useCallback(
    async (
      name: keyof typeof WALLETTYPES,
      account?: IWalletAccount,
    ): Promise<IWalletAccount[] | undefined> => {
      let tempAccount;
      switch (name) {
        case WALLETTYPES.ECKO:
          tempAccount = await eckoAccountLogin();
          break;
        case WALLETTYPES.CHAINWEAVER:
          if (account) {
            tempAccount = account;
            break;
          }
          const result = await chainweaverAccountLogin();
          if (result.length > 1) {
            return result;
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
        setAccount(tempAccount);
        addAccount2User(tempAccount);

        router.replace('/');
      }
    },

    [router, addAccount2User],
  );

  const removeAccount = useCallback(
    async (accountVal: string) => {
      removeAccountFromUser(accountVal);
    },
    [removeAccountFromUser],
  );

  useEffect(() => {
    const storage = localStorage.getItem(getAccountCookieName());
    if (storage && storage !== 'undefined') {
      try {
        const found = userData?.accounts.find((a) => a.address === storage);
        setAccount(found);
      } catch (e) {
        localStorage.removeItem(getAccountCookieName());
      }
    }
  }, [account?.address, userData?.accounts]);

  const initProps = useCallback(
    async (asset?: IAsset) => {
      setIsMounted(false);
      if (!account || !asset) {
        setIsMounted(true);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      Promise.allSettled([
        setAssetRolesForAccount(account.address, asset),
        checkIsOwner(account, asset),
        checkIsComplianceOwner(account, asset),
        checkIsInvestor(account, asset),
        checkIsAgent(account, asset),
        checkIsFrozen(account, asset),
      ]).then((v) => {
        setIsMounted(true);
      });
    },
    [account],
  );

  const checkAccountAssetRoles = useCallback(
    async (asset?: IAsset) => {
      await initProps(asset);
    },
    [account],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    initProps();
  }, []);

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
    <AccountContext.Provider
      value={{
        account,
        accounts: userData?.accounts ?? [],
        addAccount,
        removeAccount,
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
        checkAccountAssetRoles,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
