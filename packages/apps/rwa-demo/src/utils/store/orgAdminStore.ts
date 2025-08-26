import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResultWithClaims } from '@/providers/UserProvider/UserProvider';
import { off, onValue, ref } from 'firebase/database';
import { database } from './firebase';

export interface IUserListItem {
  uid: string;
  email: string;
  emailVerified: boolean;
  isOrgAdmin: boolean;
  rootAdmin: boolean;
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

  const getUserList = async (
    token: IdTokenResultWithClaims,
  ): Promise<Response> => {
    return fetch(`/api/admin/users?organisationId=${organisationId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  const setAdmin = async ({
    email,
    token,
  }: {
    email: string;
    token: IdTokenResultWithClaims;
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
    token: IdTokenResultWithClaims;
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
    token: IdTokenResultWithClaims;
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
    token: IdTokenResultWithClaims;
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
    getUserList,
    setUser,
    removeUser,
  };
};
