import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import { get, off, onValue, ref, set } from 'firebase/database';
import { getAsset } from '../getAsset';
import { database } from './firebase';

const getAssetFolder = () => getAsset().replace('.', '');

const RWAStore = () => {
  const addTransaction = async (
    account: IWalletAccount,
    data: ITransaction,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listener, ...newTransaction } = data;
    await set(ref(database, `accounts/${account.address}/${data.uuid}`), data);
  };

  const removeTransaction = async (
    account: IWalletAccount,
    data: ITransaction,
  ) => {
    await set(ref(database, `accounts/${account.address}/${data.uuid}`), null);
  };

  const getAllTransactions = async (
    account: IWalletAccount,
  ): Promise<ITransaction[]> => {
    if (!account) return [];
    const snapshot = await get(ref(database, `accounts/${account.address}`));

    const data = snapshot.toJSON();
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => value);
  };

  const listenToAllTransactions = (
    account: IWalletAccount,
    setDataCallback: (transactions: ITransaction[]) => void,
  ) => {
    const accountRef = ref(database, `accounts/${account.address}`);
    onValue(accountRef, async (snapshot) => {
      const data = await getAllTransactions(account);
      setDataCallback(data);
    });

    return () => off(accountRef);
  };

  const getAccounts = async (): Promise<IRegisterIdentityProps[]> => {
    const asset = getAssetFolder();
    if (!asset) return [];

    const snapshot = await get(ref(database, `${asset}/accounts`));

    const data = snapshot.toJSON();
    if (!data) return [];
    return Object.entries(data).map(
      ([key, value]) => value,
    ) as IRegisterIdentityProps[];
  };

  const getAccount = async ({
    account,
  }: {
    account: string;
  }): Promise<IRegisterIdentityProps | undefined> => {
    const asset = getAssetFolder();
    if (!asset) return;

    const snapshot = await get(ref(database, `${asset}/accounts/${account}`));

    return snapshot.toJSON() as IRegisterIdentityProps;
  };

  const setAccount = async ({
    accountName,
    alias,
  }: Omit<IRegisterIdentityProps, 'agent'>) => {
    const asset = getAssetFolder();
    console.log({ asset });
    if (!asset) return;

    await set(ref(database, `${asset}/accounts/${accountName}`), {
      accountName,
      alias: alias ?? '',
    });
  };

  const listenToAccount = (
    account: string,
    setDataCallback: (account: IRegisterIdentityProps) => void,
  ) => {
    const asset = getAssetFolder();
    if (!asset) return;

    const accountRef = ref(database, `${asset}/accounts/${account}`);
    onValue(accountRef, async (snapshot) => {
      const data = snapshot.toJSON();

      if (!data) return;
      setDataCallback(data as IRegisterIdentityProps);
    });

    return () => off(accountRef);
  };

  const listenToAccounts = (setDataCallback: (aliases: any[]) => void) => {
    const asset = getAssetFolder();
    if (!asset) return;

    const accountRef = ref(database, `${asset}/accounts`);
    onValue(accountRef, async (snapshot) => {
      const data = snapshot.toJSON();
      if (!data) return setDataCallback([]);

      setDataCallback(
        Object.entries(data).map(
          ([key, value]) => value,
        ) as IRegisterIdentityProps[],
      );
    });

    return () => off(accountRef);
  };

  return {
    addTransaction,
    removeTransaction,
    getAllTransactions,
    listenToAllTransactions,

    setAccount,
    getAccount,
    getAccounts,
    listenToAccount,
    listenToAccounts,
  };
};

export const store = RWAStore();
