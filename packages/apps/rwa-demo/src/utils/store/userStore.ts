import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IUserData } from '@/contexts/UserContext/UserContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import type { User } from 'firebase/auth';
import { get, off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

const UserStore = () => {
  //gets user info from FB
  const getUser = async (organisation: IOrganisation, uid: string) => {
    const snapshot = await get(
      ref(database, `/organisations/${organisation.id}/users/${uid}`),
    );

    return snapshot.val();
  };
  const addAccountAddress = async (
    user: User,
    organisation: IOrganisation,
    account: IWalletAccount,
  ) => {
    const userFB = await getUser(organisation, user.uid);
    const accounts = { ...userFB.accounts, [account.address]: account };
    return await set(
      ref(
        database,
        `/organisations/${organisation.id}/users/${user.uid}/accounts`,
      ),
      accounts,
    );
  };

  const listenToUser = (
    organisationId: IOrganisation['id'],
    uid: User['uid'],
    setDataCallback: (user: IUserData) => void,
  ) => {
    if (!organisationId) return;
    const userRef = ref(
      database,
      `organisations/${organisationId}/users/${uid}`,
    );
    onValue(userRef, async (snapshot) => {
      const data = { ...snapshot.val(), uid: snapshot.key } as IUserData;
      setDataCallback(data);
    });

    return () => off(userRef);
  };

  return { listenToUser, addAccountAddress };
};

export const userStore = UserStore();
