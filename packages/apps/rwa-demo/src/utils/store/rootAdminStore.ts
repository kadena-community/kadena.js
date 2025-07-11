import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import type { IdTokenResultWithClaims } from '@/providers/UserProvider/UserProvider';
import { get, off, onValue, push, ref, set } from 'firebase/database';
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
    token: IdTokenResultWithClaims;
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
    token: IdTokenResultWithClaims;
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

  const removeOrganisation = async (organisationId: string) => {
    return set(ref(database, `/organisationsData/${organisationId}`), null);
  };

  const getAllDomains = async (): Promise<string[]> => {
    const snapshot = await get(ref(database, `/organisationsData`));
    const data = snapshot.toJSON();

    const dataArray = Object.entries(data ?? {}).map(([_, v]) => v);

    return dataArray.reduce((acc, value) => {
      const org = value as IOrganisation;
      const domains = Object.entries(org?.domains ?? {}).map(
        ([_, domain]) => domain.value,
      );

      return [...acc, ...domains];
    }, []) as string[];
  };

  return {
    setAdmin,
    removeAdmin,
    listenToAdmins,
    createOrganisation,
    removeOrganisation,
    getAllDomains,
  };
};
