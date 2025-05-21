import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { off, onValue, ref } from 'firebase/database';
import { database } from './firebase';

const OrganisationStore = () => {
  const listenToOrganisation = (
    organisationId: IOrganisation['id'],
    setDataCallback: (organisation: IOrganisation) => void,
  ) => {
    if (!organisationId) return;
    const orgRef = ref(database, `organisations/${organisationId}`);
    onValue(orgRef, async (snapshot) => {
      const { data } = { ...snapshot.val(), id: snapshot.key } as {
        data: IOrganisation;
      };
      setDataCallback(data);
    });

    return () => off(orgRef);
  };

  return { listenToOrganisation };
};

export const orgStore = OrganisationStore();
