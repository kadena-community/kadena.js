import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResult } from 'firebase/auth';
import { off, onValue, ref } from 'firebase/database';
import { database } from './firebase';

export interface IUserListItem {
  id: string;
  displayName: string;
}

export const OrgAdminStore = (organisationId: IOrganisation['id']) => {
  const listenToAdmins = (setDataCallback: (users: string[]) => void) => {
    const orgRef = ref(database, `/organisationRoles/${organisationId}`);
    onValue(orgRef, async (snapshot) => {
      const data = snapshot.val();
      const arr = Object.entries(data ?? []).map(
        ([key, value]) => key,
      ) as string[];

      setDataCallback(arr);
    });

    return () => off(orgRef);
  };

  const listenToUsers = (setDataCallback: (users: IUserListItem[]) => void) => {
    const orgRef = ref(database, `/organisationsUsers/${organisationId}`);
    onValue(orgRef, async (snapshot) => {
      const data = snapshot.val() as Record<string, IUserListItem> | null;
      if (!data) {
        setDataCallback([]);
        return;
      }
      const arr = Object.entries(data ?? []).map(
        ([key, value]) => ({ ...value, uid: key }) as IUserListItem,
      ) as IUserListItem[];

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
    const result = await fetch(
      `/api/admin/claims?organisationId=${organisationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          organisationId,
        }),
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
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

    return result;
  };

  const setUser = async ({
    email,
    token,
  }: {
    email: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch(
      `/api/admin/user?organisationId=${organisationId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          email: email,
          organisationId,
        }),
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  };

  const removeUser = async ({
    uid,
    token,
  }: {
    uid: string;
    token: IdTokenResult;
  }) => {
    const result = await fetch(
      `/api/admin/user?uid=${uid}&organisationId=${organisationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return result;
  };

  return {
    setAdmin,
    removeAdmin,
    listenToAdmins,
    listenToUsers,
    setUser,
    removeUser,
  };
};
