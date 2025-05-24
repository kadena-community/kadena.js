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
  const getUser = async () => {
    const snapshot = await get(ref(database, dbLocationString));

    return snapshot.val();
  };
  const addAccountAddress = async (account: IWalletAccount) => {
    const userFB = await getUser();
    const accounts = { ...userFB?.accounts, [account.address]: account };
    return await set(ref(database, `${dbLocationString}/accounts`), accounts);
  };
  const removeAccountAddress = async (address: string) => {
    const userFB = await getUser();
    const accounts = { ...userFB?.accounts };
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

  return { listenToUser, addAccountAddress, removeAccountAddress };
};
