import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { get, off, onValue, ref, set } from 'firebase/database';
import { getOriginKey } from '../getOriginKey';
import { database } from './firebase';

export const OrganisationStore = async (
  organisationIdProp?: IOrganisation['id'],
) => {
  let organisationId: IOrganisation['id'] | undefined = organisationIdProp;
  if (!organisationIdProp) {
    try {
      const result = await fetch('/api/origin', {});

      if (result.status !== 200) {
        return;
      }

      const data = await result.json();
      organisationId = data.organisationId;
    } catch (error) {
      return;
    }
  }

  if (!organisationId) {
    return;
  }
  const dbLocationString = `/organisationsData/${organisationId}`;

  const listenToOrganisation = (
    setDataCallback: (organisation: IOrganisation) => void,
  ) => {
    const orgRef = ref(database, dbLocationString);
    onValue(orgRef, async (snapshot) => {
      const data = snapshot.val() as IOrganisation;
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
    const domains = organisation.domains?.reduce((acc, val) => {
      const key = getOriginKey(val.value);
      if (!key) return acc;
      return { ...acc, [key]: val };
    }, {});

    return await set(ref(database, `/organisationsData/${organisationId}`), {
      ...organisation,
      domains,
    });
  };

  return {
    listenToOrganisation,
    getOrganisations,
    getOrganisation,
    updateOrganisation,
  };
};
