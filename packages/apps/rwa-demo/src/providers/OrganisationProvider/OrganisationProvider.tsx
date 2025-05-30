'use client';

import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

export const OrganisationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();
  const router = useRouter();

  const init = async () => {
    const orgStore = await OrganisationStore();

    //if there is no organisation found,
    //it is not allowed to be on this domain
    if (!orgStore) {
      console.log('no organisation');
      router.push('/404');
      return;
    }
    const data = await orgStore.getCurrentOrganisation();
    setOrganisation(data);
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    init();
  }, []);

  return (
    <OrganisationContext.Provider value={{ organisation }}>
      {children}
    </OrganisationContext.Provider>
  );
};
