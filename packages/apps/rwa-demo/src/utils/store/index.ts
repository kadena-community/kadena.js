import { LOCALSTORAGE_ACCOUNTS } from '@/constants';
import type { IAsset } from '@/contexts/AssetContext/AssetContext';
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

export const getAccountVal = (val: string) => val.replace(/\./g, '');

export const GetAccountsLocalStorageKey = (asset?: IAsset) => {
  if (!asset) return '';
  return `${getAssetFolder(asset)}_${LOCALSTORAGE_ACCOUNTS}`;
};

export const RWAStore = (organisation: IOrganisation) => {
  if (!organisation) {
    throw new Error('no organisation or user found');
  }
  const dbLocationString = `/organisations/${organisation.id}`;
  const dbLocationTxString = `/organisationsTxs/${organisation.id}`;

  const addTransaction = async (data: ITransaction, asset?: IAsset) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listener, ...newData } = data;

    await set(
      ref(
        database,
        `${dbLocationTxString}/assets/${assetFolder}/transactions/${data.uuid}`,
      ),
      newData,
    );
  };

  const removeTransaction = async (data: ITransaction, asset?: IAsset) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    //check if the transaction exists before removing
    const snapshot = await get(
      ref(
        database,
        `${dbLocationTxString}/assets/${assetFolder}/transactions/${data.uuid}`,
      ),
    );
    const foundTx = snapshot.toJSON() as ITransaction;

    if (!foundTx) return;

    await set(
      ref(
        database,
        `${dbLocationTxString}/assets/${assetFolder}/transactions/${data.uuid}`,
      ),
      null,
    );
  };

  const getOverallTransactions = async (
    asset?: IAsset,
  ): Promise<ITransaction[]> => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return [];

    const snapshot = await get(
      ref(database, `${dbLocationTxString}/assets/${assetFolder}/transactions`),
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
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    const accountRef = ref(
      database,
      `${dbLocationTxString}/assets/${assetFolder}/transactions`,
    );
    onValue(accountRef, async (snapshot) => {
      const data = await getOverallTransactions(asset);
      setDataCallback(data);
    });

    return () => off(accountRef);
  };

  const getAccounts = async (
    user?: User,
  ): Promise<IRegisterIdentityProps[]> => {
    if (!user) return [];

    const accounts =
      ref(database, `${dbLocationString}/users/${user.uid}`) ?? {};

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
    asset?: IAsset,
    user?: User,
  ): Promise<IRegisterIdentityProps | undefined> => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    const accounts = await getAccounts(user);
    return accounts.find((acc) => acc.accountName === account);
  };

  const setAccount = async (
    { accountName }: Omit<IRegisterIdentityProps, 'agent'>,
    asset?: IAsset,
    user?: User,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    const accounts = await getAccounts(user);

    let isNew = true;
    const newAccountsArray = accounts.map((account) => {
      if (account.accountName === accountName) {
        isNew = false;
      }
      return account;
    });

    if (isNew) {
      newAccountsArray.push({
        accountName,
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
    asset?: IAsset,
  ) => {
    return accounts.map((account) =>
      setAccount({ accountName: account.account }, asset),
    );
  };

  const getFrozenMessage = async (
    account: string,
    user: User,
    asset?: IAsset,
  ): Promise<string | undefined> => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return;

    const snapshot = await get(
      ref(
        database,
        `${dbLocationString}/messages/${assetFolder}/${user.uid}/${getAccountVal(account)}/frozenMessage`,
      ),
    );

    return snapshot.toJSON() as any;
  };

  const setFrozenMessage = async (
    data: ISetAddressFrozenProps,
    user: User,
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return [];

    if (data.message) {
      await set(
        ref(
          database,
          `${dbLocationString}/messages/${assetFolder}/${user.uid}/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
        data.message,
      );
    } else {
      await remove(
        ref(
          database,
          `${dbLocationString}/assets/${assetFolder}/accounts/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
      );
    }
  };

  const setFrozenMessages = async (
    data: IBatchSetAddressFrozenProps,
    user: User,
    asset?: IAsset,
  ) => {
    const assetFolder = getAssetFolder(asset);
    if (!assetFolder) return [];

    return data.investorAccounts.map((account) =>
      setFrozenMessage(
        {
          investorAccount: account,
          pause: data.pause,
          message: data.message,
        },
        user,
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
    setFrozenMessage,
    setFrozenMessages,
    getFrozenMessage,
    getOverallTransactions,
  };
};
