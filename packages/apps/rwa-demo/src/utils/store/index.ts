import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import { get, off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

const RWAStore = () => {
  const addTransaction = async (data: ITransaction) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { listener, ...newTransaction } = data;
    const tx = { ...newTransaction.tx };

    const promises = tx.sigs.map((sig) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      set(ref(database, `signees/${tx.hash}/${sig.pubKey}`), sig);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      set(ref(database, `accounts/${sig.pubKey}/${tx.hash}`), tx);
    });
    await Promise.all(promises);
  };

  const listenToAllTransactions = (
    account: IWalletAccount,
    setDataCallback: (account: string[]) => ITransaction,
  ) => {
    const accountRef = ref(
      database,
      `accounts/${account.keyset.guard.keys[0]}`,
    );
    onValue(accountRef, (snapshot) => {
      const data = snapshot.val();
      setDataCallback(data);
    });

    return () => off(accountRef);
  };

  const getAllTransactions = async (account: IWalletAccount) => {
    if (!account) return;
    const snapshot = await get(
      ref(database, `accounts/${account.keyset.guard.keys[0]}`),
    );

    const data = snapshot.toJSON();
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => value);
  };

  return { addTransaction, getAllTransactions, listenToAllTransactions };
};

export const store = RWAStore();
