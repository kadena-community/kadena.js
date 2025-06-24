import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResult } from 'firebase/auth';
import { off, onValue, push, ref, set } from 'firebase/database';
import { database } from './firebase';

export const RootAdminStore = () => {
  const listenToAdmins = (setDataCallback: (admins: string[]) => void) => {
    const orgRef = ref(database, `/organisationRoles/root`);
    onValue(orgRef, async (snapshot) => {
      const data = snapshot.val();

      const arr = Object.entries(data ?? []).map(
        ([key, value]) => key,
      ) as string[];

      setDataCallback(arr);
    });

    return () => off(orgRef);
  };

  const setAdmin = async ({
    email,
    token,
  }: {
    email: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch('/api/admin/claims', {
      method: 'POST',
      body: JSON.stringify({
        email: email,
      }),
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
    });

    return result;
  };

  const removeAdmin = async ({
    uid,
    token,
  }: {
    uid: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch(`/api/admin/claims?uid=${uid}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
    });

    return result;
  };

  const createOrganisation = async (
    data: IOrganisation,
  ): Promise<string | null> => {
    const orgRef = push(ref(database, `/organisationsData`));

    await set(ref(database, `/organisationsData/${orgRef.key}`), data);

    return orgRef.key;
  };

  return {
    setAdmin,
    removeAdmin,
    listenToAdmins,
    createOrganisation,
  };
};
