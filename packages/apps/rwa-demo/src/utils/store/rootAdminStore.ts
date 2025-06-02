import type { IdTokenResult } from 'firebase/auth';
import { off, onValue, ref } from 'firebase/database';
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

  return {
    setAdmin,
    removeAdmin,
    listenToAdmins,
  };
};
