import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { LOCALSTORAGE_ACCOUNTS } from '@/constants';
import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { ITransaction } from '@/contexts/TransactionsContext/TransactionsContext';
import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import type { User } from 'firebase/auth';
import { get, off, onValue, ref, remove, set } from 'firebase/database';
import { getAsset } from '../getAsset';
import { database } from './firebase';

export const getAssetFolder = (asset?: IAsset) => {
  if (!asset) return '';
  return getAsset(asset).replace(/\./g, '');
};

const getAccountVal = (val: string) => val.replace(/\./g, '');

const GetAccountsLocalStorageKey = (asset?: IAsset) => {
  if (!asset) return '';
  return `${getAssetFolder(asset)}_${LOCALSTORAGE_ACCOUNTS}`;
};

const RWAStore = () => {
  const addTransaction = async (
    data: ITransaction,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);

    if (!organisationId || !assetFolder) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listener, ...newData } = data;

    await set(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolder}/transactions/${data.uuid}`,
      ),
      newData,
    );
  };

  const removeTransaction = async (
    data: ITransaction,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return;

    await set(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolder}/transactions/${data.uuid}`,
      ),
      null,
    );
  };

  const getOverallTransactions = async (
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ): Promise<ITransaction[]> => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return [];

    const snapshot = await get(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolder}/transactions`,
      ),
    );
    const data = snapshot.toJSON() as ITransaction;

    if (!data) return [];
    return Object.entries(data).map(([key, value]) => {
      if (!value.accounts) return value;
      const accounts = Object.entries(value.accounts).map(([_, v]) => v);
      return { ...value, accounts };
    });
  };

  //TODO: this needs to be more efficient
  const listenToTransactions = (
    setDataCallback: (transactions: ITransaction[]) => void,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return [];

    const accountRef = ref(
      database,
      `/organisations/${organisationId}/assets/${assetFolder}/transactions`,
    );
    onValue(accountRef, async (snapshot) => {
      const data = await getOverallTransactions(organisationId, asset);
      setDataCallback(data);
    });

    return () => off(accountRef);
  };

  const getAccounts = async (
    organisationId?: IOrganisation['id'],
    user?: User,
  ): Promise<IRegisterIdentityProps[]> => {
    if (!organisationId || !user) return [];

    const accounts = ref(
      database,
      `/organisations/${organisationId}/users/${user.uid}`,
    );

    return Object.entries(accounts).map(
      ([_, val]) => val as IRegisterIdentityProps,
    );
  };

  const getAccount = async (
    {
      account,
    }: {
      account: string;
    },

    organisationId?: IOrganisation['id'],
    asset?: IAsset,
    user?: User,
  ): Promise<IRegisterIdentityProps | undefined> => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return;

    const accounts = await getAccounts(organisationId, user);
    return accounts.find((acc) => acc.accountName === account);
  };

  const setAccount = async (
    { accountName, alias }: Omit<IRegisterIdentityProps, 'agent'>,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
    user?: User,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return;

    const accounts = await getAccounts(organisationId, user);

    let isNew = true;
    const newAccountsArray = accounts.map((account) => {
      if (account.accountName === accountName) {
        isNew = false;
        account.alias = alias;
      }
      return account;
    });

    if (isNew) {
      newAccountsArray.push({
        accountName,
        alias,
      } as IRegisterIdentityProps);
    }

    localStorage.setItem(
      GetAccountsLocalStorageKey(asset),
      JSON.stringify(newAccountsArray),
    );
    window.dispatchEvent(new Event(GetAccountsLocalStorageKey(asset)));
  };

  const setAllAccounts = async (
    { accounts }: { accounts: ICSVAccount[] },
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    return accounts.map((account) =>
      setAccount(
        { accountName: account.account, alias: account.alias },
        organisationId,
        asset,
      ),
    );
  };

  const listenToAccount = (
    account: string,
    setDataCallback: (account: IRegisterIdentityProps) => void,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
    user?: User,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder || !user) return;

    const storageListener = async () => {
      const accounts = await getAccounts(organisationId, user);

      const foundAccount = accounts.find((acc) => acc.accountName === account);
      if (!foundAccount) return;

      setDataCallback(foundAccount);
    };

    window.addEventListener(GetAccountsLocalStorageKey(asset), storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(
        GetAccountsLocalStorageKey(asset),
        storageListener,
      );
      window.removeEventListener('storage', storageListener);
    };
  };

  const listenToAccounts = (
    setDataCallback: (aliases: any[]) => void,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
    user?: User,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return;

    const storageListener = async () => {
      const accounts = await getAccounts(organisationId, user);
      setDataCallback(accounts);
    };

    window.addEventListener(GetAccountsLocalStorageKey(asset), storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(
        GetAccountsLocalStorageKey(asset),
        storageListener,
      );
      window.removeEventListener('storage', storageListener);
    };
  };

  const getFrozenMessage = async (
    account: string,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ): Promise<string | undefined> => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return;

    const snapshot = await get(
      ref(
        database,
        `/organisations/${organisationId}/assets/${assetFolder}/accounts/${getAccountVal(account)}/frozenMessage`,
      ),
    );

    return snapshot.toJSON() as any;
  };

  const setFrozenMessage = async (
    data: ISetAddressFrozenProps,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return [];

    if (data.message) {
      await set(
        ref(
          database,
          `/organisations/${organisationId}/assets/${assetFolder}/accounts/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
        data.message,
      );
    } else {
      await remove(
        ref(
          database,
          `/organisations/${organisationId}/assets/${assetFolder}/accounts/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
      );
    }
  };

  const setFrozenMessages = async (
    data: IBatchSetAddressFrozenProps,
    organisationId?: IOrganisation['id'],
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!organisationId || !assetFolder) return [];

    return data.investorAccounts.map((account) =>
      setFrozenMessage(
        {
          investorAccount: account,
          pause: data.pause,
          message: data.message,
        },
        organisationId,
        asset,
      ),
    );
  };

  return {
    addTransaction,
    removeTransaction,
    listenToTransactions,

    setAccount,
    setAllAccounts,
    getAccount,
    getAccounts,
    listenToAccount,
    listenToAccounts,
    setFrozenMessage,
    setFrozenMessages,
    getFrozenMessage,
  };
};

export const store = RWAStore();
