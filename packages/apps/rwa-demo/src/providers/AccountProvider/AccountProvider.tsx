'use client';

import { WALLETTYPES } from '@/constants';
import { AccountContext } from '@/contexts/AccountContext/AccountContext';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import { useGetAccountKDABalance } from '@/hooks/getAccountKDABalance';
import { useGetAgentRoles } from '@/hooks/getAgentRoles';
import { useUser } from '@/hooks/user';
import { isAgent } from '@/services/isAgent';
import { isComplianceOwner } from '@/services/isComplianceOwner';
import { isFrozen } from '@/services/isFrozen';
import { isInvestor } from '@/services/isInvestor';
import { isOwner } from '@/services/isOwner';
import { getAccountCookieName } from '@/utils/getAccountCookieName';
import {
  getWalletAdapterName,
  mapWalletAdapterAccount,
} from '@/utils/walletAdapter/wallet-adapter';
import type { ICommand, IUnsignedCommand } from '@kadena/client';
import { useNotifications } from '@kadena/kode-ui/patterns';
import { useKadenaWallet } from '@kadena/wallet-adapter-react';
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
  const router = useRouter();
  const wallet = useKadenaWallet();

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
  };

  const addAccount = useCallback(
    async (
      name: keyof typeof WALLETTYPES,
      account?: IWalletAccount,
    ): Promise<IWalletAccount[] | undefined> => {
      let tempAccount: IWalletAccount | undefined;
      switch (name) {
        case WALLETTYPES.ECKO: {
          const adapter = wallet.client.getAdapter('Ecko');
          if (!adapter) throw new Error('Ecko adapter not detected');
          const result = await adapter.connect();
          if (!result) throw new Error('Ecko connection failed');
          tempAccount = mapWalletAdapterAccount(result, WALLETTYPES.ECKO);
          break;
        }
        case WALLETTYPES.CHAINWEAVER: {
          if (account) {
            tempAccount = account;
            break;
          }
          const adapter = wallet.client.getAdapter('Ecko');
          if (!adapter) throw new Error('Chainweaver adapter not detected');
          await adapter.connect();
          const result = await adapter.getAccounts();
          if (!result) throw new Error('Chainweaver connection failed');
          const accounts = result.map((acc) =>
            mapWalletAdapterAccount(acc, WALLETTYPES.CHAINWEAVER),
          );

          if (accounts.length > 1) {
            return accounts;
          } else if (accounts.length === 1) {
            tempAccount = accounts[0];
          }
          break;
        }
        case WALLETTYPES.MAGIC: {
          const adapter = wallet.client.getAdapter('Ecko');
          if (!adapter) throw new Error('Magic adapter not detected');
          const result = await adapter.connect();
          if (!result) throw new Error('Magic connection failed');
          tempAccount = mapWalletAdapterAccount(result, WALLETTYPES.MAGIC);
          break;
        }
        default: {
          addNotification({
            intent: 'negative',
            label: 'Provider does not exist',
            message: `Provider (${name}) does not exist`,
          });
        }
      }

      if (tempAccount) {
        await addAccount2User(tempAccount);
        await setAccount(tempAccount);

        if (tempAccount) {
          localStorage.setItem(getAccountCookieName(), tempAccount.address);
        }

        addNotification({
          intent: 'positive',
          message: `Account added successfully`,
        });
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

        if (!found && userData?.accounts.length === 1) {
          // If there is only one account, we can set it as the current account
          setAccount(userData?.accounts[0]);
        }
      } catch (e) {
        localStorage.removeItem(getAccountCookieName());
      }
    } else {
      if (userData?.accounts.length === 1) {
        setAccount(userData?.accounts[0]);
      }
    }
  }, [account?.address, userData?.accounts.length]);

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
    const adapterName = account
      ? getWalletAdapterName(account.walletName)
      : undefined;

    if (!adapterName) {
      addNotification({
        intent: 'negative',
        label: 'Provider does not exist',
        message: `Provider (${account?.walletType}) does not exist`,
      });
      return;
    }

    const adapter = wallet.client.getAdapter(adapterName);
    if (!adapter) throw new Error(`${adapterName} adapter not detected`);
    const result = await adapter.connect();
    if (!result) throw new Error(`${adapterName} connection failed`);

    console.log('signing via wallet adapter', tx);
    const signed = (await adapter.signTransaction(tx)) as ICommand;
    console.log('signed', signed);

    return signed;
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
        accountRoles,
        isGasPayable: !isBalanceMounted ? undefined : kdaBalance > 0,
        checkAccountAssetRoles,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};
