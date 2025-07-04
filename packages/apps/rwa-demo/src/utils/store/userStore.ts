import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IUserData } from '@/contexts/UserContext/UserContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { User } from 'firebase/auth';
import { get, off, onValue, ref, set } from 'firebase/database';

import { database } from './firebase';

export const UserStore = (organisation: IOrganisation, user: User) => {
  if (!organisation || !user) {
    throw new Error('no organisation or user found');
  }
  const dbLocationString = `/organisations/${organisation.id}/users/${user.uid}`;

  //gets user info from FB
  const getUserAccounts = async () => {
    const snapshot = await get(
      ref(
        database,
        `/organisations/${organisation.id}/users/${user.uid}/accounts`,
      ),
    );

    return snapshot.val() as Record<string, IWalletAccount>;
  };

  const addAccountAddress = async (account: IWalletAccount) => {
    const userFBAccounts = await getUserAccounts();

    const accounts = { ...userFBAccounts, [account.address]: account };
    return await set(ref(database, `${dbLocationString}/accounts`), accounts);
  };
  const removeAccountAddress = async (address: string) => {
    const userFBAccounts = await getUserAccounts();
    const accounts: Record<string, IWalletAccount> = userFBAccounts;
    if (!accounts) return;
    delete accounts[address];

    return await set(ref(database, `${dbLocationString}/accounts`), accounts);
  };

  const listenToUser = (setDataCallback: (user: IUserData) => void) => {
    const userRef = ref(database, dbLocationString);
    onValue(userRef, async (snapshot) => {
      const data = { ...snapshot.val(), uid: snapshot.key } as IUserData;
      const newData = {
        ...data,
        accounts: Object.entries(data.accounts ?? {})?.map(([, val]) => {
          return val;
        }),
      };

      setDataCallback(newData);
    });

    return () => off(userRef);
  };

  const changeProfile = async (uid: string, userData: IUserData['data']) => {
    if (!uid) return;
    await set(ref(database, `${dbLocationString}/data`), userData);
    await set(
      ref(database, `/organisationsUsers/${organisation.id}/${uid}`),
      userData,
    );
    await set(ref(database, `${dbLocationString}/data`), userData);
  };

  const addAccountAlias = async (address: string, alias: string) => {
    await set(ref(database, `${dbLocationString}/aliases/${address}`), {
      alias,
    });
  };

  return {
    listenToUser,
    addAccountAddress,
    removeAccountAddress,
    changeProfile,
    addAccountAlias,
  } as const;
};
