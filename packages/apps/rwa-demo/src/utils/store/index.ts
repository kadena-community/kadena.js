import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { LOCALSTORAGE_ACCOUNTS } from '@/constants';
import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import type { IBatchSetAddressFrozenProps } from '@/services/batchSetAddressFrozen';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import { get, off, onValue, ref, remove, set } from 'firebase/database';
import { getAsset } from '../getAsset';
import { database } from './firebase';

const getAssetFolder = () => getAsset().replace(/\./g, '');
const getAccountVal = (val: string) => val.replace(/\./g, '');

const GetAccountsLocalStorageKey = () => {
  return `${getAssetFolder()}_${LOCALSTORAGE_ACCOUNTS}`;
};

const RWAStore = () => {
  const addTransaction = async (data: ITransaction) => {
    const asset = getAssetFolder();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listener, ...newData } = data;

    await set(ref(database, `${asset}/transactions/${data.uuid}`), newData);
  };

  const removeTransaction = async (data: ITransaction) => {
    const asset = getAssetFolder();
    await set(ref(database, `${asset}/transactions/${data.uuid}`), null);
  };

  const getOverallTransactions = async (): Promise<ITransaction[]> => {
    const asset = getAssetFolder();
    const snapshot = await get(ref(database, `${asset}/transactions`));

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
  ) => {
    const asset = getAssetFolder();
    const accountRef = ref(database, `${asset}/transactions`);
    onValue(accountRef, async (snapshot) => {
      const data = await getOverallTransactions();
      setDataCallback(data);
    });

    return () => off(accountRef);
  };

  const getAccounts = async (): Promise<IRegisterIdentityProps[]> => {
    const asset = getAssetFolder();
    if (!asset) return [];

    const accounts: IRegisterIdentityProps[] = await JSON.parse(
      localStorage.getItem(GetAccountsLocalStorageKey()) ?? '[]',
    );

    return accounts;
  };

  const getAccount = async ({
    account,
  }: {
    account: string;
  }): Promise<IRegisterIdentityProps | undefined> => {
    const asset = getAssetFolder();
    if (!asset) return;

    const accounts = await getAccounts();

    return accounts.find((acc) => acc.accountName === account);
  };

  const setAccount = async ({
    accountName,
    alias,
  }: Omit<IRegisterIdentityProps, 'agent'>) => {
    const asset = getAssetFolder();
    if (!asset) return;

    const accounts = await getAccounts();

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
      GetAccountsLocalStorageKey(),
      JSON.stringify(newAccountsArray),
    );
    window.dispatchEvent(new Event(GetAccountsLocalStorageKey()));
  };

  const setAllAccounts = async ({ accounts }: { accounts: ICSVAccount[] }) => {
    return accounts.map((account) =>
      setAccount({ accountName: account.account, alias: account.alias }),
    );
  };

  const listenToAccount = (
    account: string,
    setDataCallback: (account: IRegisterIdentityProps) => void,
  ) => {
    const asset = getAssetFolder();
    if (!asset) return;

    const storageListener = async () => {
      const accounts = await getAccounts();

      const foundAccount = accounts.find((acc) => acc.accountName === account);
      if (!foundAccount) return;

      setDataCallback(foundAccount);
    };

    window.addEventListener(GetAccountsLocalStorageKey(), storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(GetAccountsLocalStorageKey(), storageListener);
      window.removeEventListener('storage', storageListener);
    };
  };

  const listenToAccounts = (setDataCallback: (aliases: any[]) => void) => {
    const asset = getAssetFolder();
    if (!asset) return;

    const storageListener = async () => {
      const accounts = await getAccounts();
      setDataCallback(accounts);
    };

    window.addEventListener(GetAccountsLocalStorageKey(), storageListener);
    window.addEventListener('storage', storageListener);

    return () => {
      window.removeEventListener(GetAccountsLocalStorageKey(), storageListener);
      window.removeEventListener('storage', storageListener);
    };
  };

  const getFrozenMessage = async (
    account: string,
  ): Promise<string | undefined> => {
    const asset = getAssetFolder();
    if (!asset) return;

    const snapshot = await get(
      ref(
        database,
        `${asset}/accounts/${getAccountVal(account)}/frozenMessage`,
      ),
    );

    return snapshot.toJSON() as any;
  };

  const setFrozenMessage = async (data: ISetAddressFrozenProps) => {
    const asset = getAssetFolder();
    if (!asset) return;

    if (data.message) {
      await set(
        ref(
          database,
          `${asset}/accounts/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
        data.message,
      );
    } else {
      await remove(
        ref(
          database,
          `${asset}/accounts/${getAccountVal(data.investorAccount)}/frozenMessage`,
        ),
      );
    }
  };

  const setFrozenMessages = async (data: IBatchSetAddressFrozenProps) => {
    const asset = getAssetFolder();
    if (!asset) return;

    return data.investorAccounts.map((account) =>
      setFrozenMessage({
        investorAccount: account,
        pause: data.pause,
        message: data.message,
      }),
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
