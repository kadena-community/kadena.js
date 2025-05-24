import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { off, onValue, ref } from 'firebase/database';
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

  return { listenToOrganisation };
};
