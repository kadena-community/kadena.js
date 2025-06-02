import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IUserData } from '@/contexts/UserContext/UserContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { IdTokenResult, User } from 'firebase/auth';
import { get, off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

export const UserStore = (organisation: IOrganisation, user: User) => {
  if (!organisation || !user) {
    throw new Error('no organisation or user found');
  }
  const dbLocationString = `/organisations/${organisation.id}/users/${user.uid}`;

  //gets user info from FB
  const getUserAccounts = async () => {
    const snapshot = await get(ref(database, `${dbLocationString}/accounts`));

    return snapshot.val();
  };

  const addAccountAddress = async (account: IWalletAccount) => {
    const userFBAccounts = await getUserAccounts();
    const accounts = { ...userFBAccounts, [account.address]: account };
    return await set(ref(database, `${dbLocationString}/accounts`), accounts);
  };
  const removeAccountAddress = async (address: string) => {
    const userFBAccounts = await getUserAccounts();
    const accounts = { ...userFBAccounts };
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

  const changeProfile = async ({
    displayName,
    token,
  }: {
    displayName: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch(
      `/api/admin/profile?organisationId=${organisation.id}`,
      {
        method: 'POST',
        body: JSON.stringify({
          displayName,
          uid: user.uid,
          organisationId: organisation.id,
        }),
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  };

  return {
    listenToUser,
    addAccountAddress,
    removeAccountAddress,
    changeProfile,
  };
};
