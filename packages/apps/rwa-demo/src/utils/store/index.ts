import type { ITransaction } from '@/components/TransactionsProvider/TransactionsProvider';
import type { ICSVAccount } from '@/services/batchRegisterIdentity';
import type { IRegisterIdentityProps } from '@/services/registerIdentity';
import type { ISetAddressFrozenProps } from '@/services/setAddressFrozen';
import { get, off, onValue, ref, set } from 'firebase/database';
import { getAsset } from '../getAsset';
import { database } from './firebase';

const getAssetFolder = () => getAsset().replace('.', '');

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

    const snapshot = await get(ref(database, `${asset}/accounts`));

    const data = snapshot.toJSON();
    if (!data) return [];
    return Object.entries(data).map(
      ([key, value]) => value.account,
    ) as IRegisterIdentityProps[];
  };

  const getAccount = async ({
    account,
  }: {
    account: string;
  }): Promise<IRegisterIdentityProps | undefined> => {
    const asset = getAssetFolder();
    if (!asset) return;

    const snapshot = await get(
      ref(database, `${asset}/accounts/${account}/account`),
    );

    return snapshot.toJSON() as IRegisterIdentityProps;
  };

  const setAccount = async ({
    accountName,
    alias,
  }: Omit<IRegisterIdentityProps, 'agent'>) => {
    const asset = getAssetFolder();
    if (!asset) return;

    await set(ref(database, `${asset}/accounts/${accountName}/account`), {
      accountName,
      alias: alias ?? '',
    });
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

    const accountRef = ref(database, `${asset}/accounts/${account}/account`);
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
          ([key, value]) => value.account,
        ) as IRegisterIdentityProps[],
      );
    });

    return () => off(accountRef);
  };

  const getFrozenMessage = async (
    account: string,
  ): Promise<string | undefined> => {
    const asset = getAssetFolder();
    if (!asset) return;

    const snapshot = await get(
      ref(database, `${asset}/accounts/${account}/frozenMessage`),
    );

    return snapshot.toJSON() as any;
  };

  const setFrozenMessage = async (data: ISetAddressFrozenProps) => {
    const asset = getAssetFolder();
    if (!asset || !data.message) return;

    await set(
      ref(database, `${asset}/accounts/${data.investorAccount}/frozenMessage`),
      data.message,
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
    getFrozenMessage,
  };
};

export const store = RWAStore();
