import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResult } from 'firebase/auth';
import { off, onValue, ref } from 'firebase/database';
import { database } from './firebase';

export const OrgAdminStore = (organisationId: IOrganisation['id']) => {
  const listenToAdmins = (setDataCallback: (admins: string[]) => void) => {
    const orgRef = ref(database, `/roles/${organisationId}`);
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
        organisationId,
      }),
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (result.status !== 200) {
      return;
    }

    return result.json();
  };

  const removeAdmin = async ({
    uid,
    token,
  }: {
    uid: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch(
      `/api/admin/claims?uid=${uid}&organisationId=${organisationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (result.status !== 200) {
      return;
    }

    return result.json();
  };

  return {
    setAdmin,
    removeAdmin,
    listenToAdmins,
  };
};
