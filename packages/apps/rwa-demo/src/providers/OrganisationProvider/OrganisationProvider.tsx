'use client';

import type { IOrganisation } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationContext } from '@/contexts/OrganisationContext/OrganisationContext';
import { OrganisationStore } from '@/utils/store/organisationStore';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect, useState } from 'react';

export const OrganisationProvider: FC<PropsWithChildren> = ({ children }) => {
  const [organisation, setOrganisation] = useState<IOrganisation | undefined>();
  const [orgStore, setOrgStore] = useState<any>();
  const router = useRouter();

  const init = async () => {
    const orgStore = await OrganisationStore();

    if (!orgStore) {
      router.push('/404');
    }

    setOrgStore(orgStore);
  };

  useEffect(() => {
    if (!orgStore) return;
    const unlisten = orgStore.listenToOrganisation(setOrganisation);
    return unlisten;
  }, [orgStore]);

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
