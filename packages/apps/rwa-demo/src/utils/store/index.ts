import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { get, off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

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

  return {
    addTransaction,
    removeTransaction,
    getAllTransactions,
    listenToAllTransactions,
  };
};

export const store = RWAStore();
