import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { get, off, onValue, ref, set } from 'firebase/database';
import { database } from './firebase';

export const OrganisationStore = (organisationId: IOrganisation['id']) => {
  if (!organisationId) {
    throw new Error('no organisation or user found');
  }
  const dbLocationString = `/organisations/${organisationId}`;

  const listenToOrganisation = (
    setDataCallback: (organisation: IOrganisation) => void,
  ) => {
    const orgRef = ref(database, dbLocationString);
    onValue(orgRef, async (snapshot) => {
      const { data } = snapshot.val() as {
        data: IOrganisation;
      };
      setDataCallback({ ...data, id: snapshot.key ?? '' });
    });

    return () => off(orgRef);
  };

  const getOrganisations = async (): Promise<IOrganisation[]> => {
    const snapshot = await get(ref(database, `/organisationsData`));
    const data = snapshot.toJSON();
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      ...value,
      id: key,
    })) as IOrganisation[];
  };

  const getOrganisation = async (): Promise<IOrganisation> => {
    const snapshot = await get(
      ref(database, `/organisationsData/${organisationId}`),
    );

    const data = snapshot.toJSON() as any;
    const domains = Object.entries(data?.domains ?? {}).map(
      ([key, value]) => value,
    );

    return { ...data, domains, id: snapshot.key } as IOrganisation;
  };

  const updateOrganisation = async (organisation: IOrganisation) => {
    return await set(
      ref(database, `/organisationsData/${organisationId}`),
      organisation,
    );
  };

  return {
    listenToOrganisation,
    getOrganisations,
    getOrganisation,
    updateOrganisation,
  };
};
